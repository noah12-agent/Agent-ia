const { sendTextMessage } = require('../services/whatsapp.service');
const { handleIncomingMessage } = require('../services/agent.service');

const verifyWebhook = (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }

  return res.status(403).json({ error: 'Verification failed' });
};

const receiveWebhook = async (req, res) => {
  try {
    const entries = req.body?.entry || [];
    for (const entry of entries) {
      const changes = entry.changes || [];
      for (const change of changes) {
        const messages = change.value?.messages || [];
        for (const message of messages) {
          const from = message.from;
          const text = message.text?.body;
          if (!from || !text) {
            continue;
          }
          const responseText = await handleIncomingMessage(from, text);
          await sendTextMessage(from, responseText);
        }
      }
    }
    return res.sendStatus(200);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Webhook error', error);
    return res.sendStatus(500);
  }
};

module.exports = {
  verifyWebhook,
  receiveWebhook,
};
