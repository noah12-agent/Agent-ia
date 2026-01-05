const { validationResult } = require("express-validator");
const { listReservations, updateReservationStatus } = require("../services/reservationService");

const handleValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return false;
  }
  return true;
};

const listReservationsHandler = (_req, res) => {
  const reservations = listReservations();
  res.json({ data: reservations });
};

const updateReservationStatusHandler = (req, res) => {
  if (!handleValidation(req, res)) {
    return;
  }

  const { id } = req.params;
  const { status } = req.body;
  const reservation = updateReservationStatus(id, status);

  if (!reservation) {
    res.status(404).json({ message: "Reservation not found." });
    return;
  }

  res.json({ data: reservation });
};

module.exports = {
  listReservationsHandler,
  updateReservationStatusHandler
};
