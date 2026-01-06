const fs = require('fs');
const path = require('path');

const intentsPath = path.join(__dirname, '..', 'data', 'faq.intents.json');
const faqIntents = JSON.parse(fs.readFileSync(intentsPath, 'utf-8'));

const normalize = (text) => text.toLowerCase();

const matchFaqIntent = (text) => {
  const lower = normalize(text);
  for (const intent of Object.values(faqIntents)) {
    if (intent.keywords.some((keyword) => lower.includes(keyword))) {
      return intent.responseKey;
    }
  }
  return null;
};

const detectIntent = (text) => {
  const lower = normalize(text);
  const humanKeywords = ['humain', 'agent', 'personne', 'restaurant'];
  if (humanKeywords.some((keyword) => lower.includes(keyword))) {
    return { type: 'human' };
  }

  const reservationKeywords = ['réserver', 'reservation', 'réservation', 'table'];
  if (reservationKeywords.some((keyword) => lower.includes(keyword))) {
    return { type: 'reservation' };
  }

  const faqKey = matchFaqIntent(text);
  if (faqKey) {
    return { type: 'faq', key: faqKey };
  }

  return { type: 'unknown' };
};

module.exports = {
  detectIntent,
};
