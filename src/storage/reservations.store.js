const fs = require('fs').promises;
const path = require('path');

const reservationsPath = path.join(__dirname, 'reservations.json');

const readReservations = async () => {
  try {
    const content = await fs.readFile(reservationsPath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    return [];
  }
};

const writeReservations = async (reservations) => {
  await fs.writeFile(reservationsPath, JSON.stringify(reservations, null, 2));
};

const addReservation = async (reservation) => {
  const reservations = await readReservations();
  reservations.push(reservation);
  await writeReservations(reservations);
  return reservation;
};

module.exports = {
  addReservation,
  readReservations,
};
