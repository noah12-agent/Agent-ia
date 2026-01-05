const express = require("express");
const { body } = require("express-validator");
const { createReservationHandler } = require("../controllers/reservationController");

const router = express.Router();

const reservationValidation = [
  body("name").trim().notEmpty().withMessage("Name is required."),
  body("phone").trim().notEmpty().withMessage("Phone is required."),
  body("date").isISO8601().withMessage("Date must be ISO8601 (YYYY-MM-DD)."),
  body("time").matches(/^\d{2}:\d{2}$/).withMessage("Time must be HH:mm."),
  body("people").isInt({ min: 1, max: 20 }).withMessage("People must be between 1 and 20."),
  body("note").optional().isLength({ max: 500 }).withMessage("Note must be under 500 chars.")
];

router.post("/reservations", reservationValidation, createReservationHandler);

module.exports = router;
