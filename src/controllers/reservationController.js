const { validationResult } = require("express-validator");
const { createReservation } = require("../services/reservationService");

const handleValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return false;
  }
  return true;
};

const createReservationHandler = (req, res) => {
  if (!handleValidation(req, res)) {
    return;
  }

  const reservation = createReservation(req.body);
  res.status(201).json({ data: reservation });
};

module.exports = {
  createReservationHandler
};
