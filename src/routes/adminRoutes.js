const express = require("express");
const { body } = require("express-validator");
const {
  listReservationsHandler,
  updateReservationStatusHandler
} = require("../controllers/adminController");

const router = express.Router();

const statusValidation = [
  body("status")
    .isIn(["pending", "confirmed", "cancelled"])
    .withMessage("Status must be pending, confirmed, or cancelled.")
];

router.get("/admin/reservations", listReservationsHandler);
router.patch("/admin/reservations/:id/status", statusValidation, updateReservationStatusHandler);

module.exports = router;
