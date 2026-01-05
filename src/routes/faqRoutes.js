const express = require("express");
const { getFaq } = require("../controllers/faqController");

const router = express.Router();

router.get("/faq", getFaq);

module.exports = router;
