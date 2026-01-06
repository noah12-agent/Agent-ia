const fs = require('fs');
const path = require('path');
const { detectIntent } = require('./intent.service');
const { addReservation } = require('../storage/reservations.store');
const { getSession, updateSession, clearSession } = require('../storage/sessions.store');

const profilePath = path.join(__dirname, '..', 'data', 'restaurant.profile.json');
const restaurantProfile = JSON.parse(fs.readFileSync(profilePath, 'utf-8'));

const humanOption = 'Option : Parler à un humain.';
const fallbackUnknown =
  'Je ne peux pas confirmer ça. Souhaitez-vous parler au restaurant ?';

const buildResponse = (message) => `${message}

${humanOption}`;

const getFaqResponse = (key) => {
  if (key === 'menu') {
    if (!restaurantProfile.menu?.length) {
      return null;
    }
    const items = restaurantProfile.menu
      .map((item) => `- ${item.item} (${item.price})`)
      .join('\n');
    return `Voici le menu de ${restaurantProfile.name} :\n${items}`;
  }

  if (key === 'hours') {
    if (!restaurantProfile.hours) {
      return null;
    }
    const hoursLines = Object.entries(restaurantProfile.hours)
      .map(([day, hours]) => `- ${day} : ${hours}`)
      .join('\n');
    return `Horaires de ${restaurantProfile.name} :\n${hoursLines}`;
  }

  if (key === 'address') {
    if (!restaurantProfile.address) {
      return null;
    }
    const locationLink = restaurantProfile.location_link
      ? `\nPlan : ${restaurantProfile.location_link}`
      : '';
    return `Adresse : ${restaurantProfile.address}.${locationLink}`;
  }

  if (key === 'delivery') {
    return restaurantProfile.faq?.delivery || null;
  }

  if (key === 'payment') {
    return restaurantProfile.faq?.payment || null;
  }

  if (key === 'allergens') {
    return restaurantProfile.faq?.allergens || null;
  }

  return null;
};

const isValidDate = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const date = new Date(`${value}T00:00:00`);
  return !Number.isNaN(date.getTime());
};

const isValidTime = (value) => {
  if (!/^\d{2}:\d{2}$/.test(value)) {
    return false;
  }
  const [hours, minutes] = value.split(':').map(Number);
  return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
};

const isValidPeople = (value) => {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 && number <= 20;
};

const parseYesNo = (text) => {
  const normalized = text.toLowerCase();
  if (['oui', 'ok', 'd\'accord', 'confirme'].some((word) => normalized.includes(word))) {
    return true;
  }
  if (['non', 'pas', 'annuler'].some((word) => normalized.includes(word))) {
    return false;
  }
  return null;
};

const startReservationFlow = async (phone) => {
  const session = {
    flow: 'reservation',
    step: 'name',
    data: {},
  };
  await updateSession(phone, session);
  return buildResponse('Très bien. Quel est votre nom pour la réservation ?');
};

const handleReservationStep = async (phone, text, session) => {
  const trimmed = text.trim();

  if (session.step === 'name') {
    if (!trimmed) {
      return buildResponse('Merci de partager votre nom.');
    }
    session.data.name = trimmed;
    session.step = 'date';
    await updateSession(phone, session);
    return buildResponse('Pour quelle date souhaitez-vous réserver ? (YYYY-MM-DD)');
  }

  if (session.step === 'date') {
    if (!isValidDate(trimmed)) {
      return buildResponse('Merci d\'indiquer une date valide au format YYYY-MM-DD.');
    }
    session.data.date = trimmed;
    session.step = 'time';
    await updateSession(phone, session);
    return buildResponse('À quelle heure ? (HH:MM)');
  }

  if (session.step === 'time') {
    if (!isValidTime(trimmed)) {
      return buildResponse('Merci d\'indiquer une heure valide au format HH:MM.');
    }
    session.data.time = trimmed;
    session.step = 'people';
    await updateSession(phone, session);
    return buildResponse('Combien de personnes ?');
  }

  if (session.step === 'people') {
    if (!isValidPeople(trimmed)) {
      return buildResponse('Merci d\'indiquer un nombre de personnes entre 1 et 20.');
    }
    session.data.people = Number(trimmed);
    session.step = 'notes';
    await updateSession(phone, session);
    return buildResponse('Des notes particulières ? (allergies, occasion, etc.)');
  }

  if (session.step === 'notes') {
    session.data.notes = trimmed || 'Aucune';
    session.step = 'confirmation';
    await updateSession(phone, session);
    const recap = `Je récapitule : ${session.data.name}, ${session.data.people} pers., le ${session.data.date} à ${session.data.time}. Notes : ${session.data.notes}.`;
    return buildResponse(`${recap} Confirmez-vous ? (oui/non)`);
  }

  if (session.step === 'confirmation') {
    const confirmation = parseYesNo(trimmed);
    if (confirmation === null) {
      return buildResponse('Merci de répondre par oui ou non. Souhaitez-vous confirmer ?');
    }

    if (confirmation === false) {
      session.step = 'name';
      session.data = {};
      await updateSession(phone, session);
      return buildResponse('D\'accord. Recommençons. Quel est votre nom ?');
    }

    const reservation = {
      ...session.data,
      status: 'pending',
      timestamp: new Date().toISOString(),
      customer_phone: phone,
    };
    await addReservation(reservation);
    await clearSession(phone);
    const recap = `Réservation en attente : ${reservation.name}, ${reservation.people} pers., le ${reservation.date} à ${reservation.time}.`;
    return buildResponse(`${recap} Merci, nous confirmons bientôt.`);
  }

  return buildResponse(fallbackUnknown);
};

const handleIncomingMessage = async (phone, text) => {
  try {
    const existingSession = await getSession(phone);
    if (existingSession?.flow === 'reservation') {
      return await handleReservationStep(phone, text, existingSession);
    }

    const intent = detectIntent(text);
    if (intent.type === 'human') {
      const message = restaurantProfile.fallback_human_message || fallbackUnknown;
      return buildResponse(message);
    }

    if (intent.type === 'reservation') {
      return await startReservationFlow(phone);
    }

    if (intent.type === 'faq') {
      const response = getFaqResponse(intent.key);
      if (!response) {
        return buildResponse(fallbackUnknown);
      }
      return buildResponse(response);
    }

    return buildResponse(fallbackUnknown);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Agent error', error);
    return buildResponse('Je rencontre un souci technique. Souhaitez-vous parler au restaurant ?');
  }
};

module.exports = {
  handleIncomingMessage,
  getFaqResponse,
  isValidDate,
  isValidTime,
  isValidPeople,
};
