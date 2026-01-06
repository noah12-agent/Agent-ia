const express = require('express');
const {
  verifyWebhook,
  receiveWebhook,
} = require('../controllers/webhook.controller');
const { validateWebhookPayload } = require('../middleware/validation');

const router = express.Router();

router.get('/', verifyWebhook);
router.post('/', validateWebhookPayload, receiveWebhook);

module.exports = router;
