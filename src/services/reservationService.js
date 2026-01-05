const { v4: uuidv4 } = require("uuid");
const { readData, writeData } = require("../storage/fileStorage");

const listReservations = () => {
  const data = readData();
  return data.reservations;
};

const createReservation = (payload) => {
  const data = readData();
  const reservation = {
    id: uuidv4(),
    status: "pending",
    createdAt: new Date().toISOString(),
    ...payload
  };

  data.reservations.push(reservation);
  writeData(data);

  return reservation;
};

const updateReservationStatus = (id, status) => {
  const data = readData();
  const reservation = data.reservations.find((item) => item.id === id);

  if (!reservation) {
    return null;
  }

  reservation.status = status;
  reservation.updatedAt = new Date().toISOString();
  writeData(data);

  return reservation;
};

module.exports = {
  listReservations,
  createReservation,
  updateReservationStatus
};
