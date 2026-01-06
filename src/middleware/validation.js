const validateWebhookPayload = (req, res, next) => {
  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({ error: 'Invalid payload' });
  }
  if (!Array.isArray(req.body.entry)) {
    return res.status(400).json({ error: 'Invalid payload' });
  }
  return next();
};

module.exports = { validateWebhookPayload };
