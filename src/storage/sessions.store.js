const fs = require('fs').promises;
const path = require('path');

const sessionsPath = path.join(__dirname, 'sessions.json');

const readSessions = async () => {
  try {
    const content = await fs.readFile(sessionsPath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    return {};
  }
};

const writeSessions = async (sessions) => {
  await fs.writeFile(sessionsPath, JSON.stringify(sessions, null, 2));
};

const getSession = async (phone) => {
  const sessions = await readSessions();
  return sessions[phone];
};

const updateSession = async (phone, data) => {
  const sessions = await readSessions();
  sessions[phone] = data;
  await writeSessions(sessions);
  return sessions[phone];
};

const clearSession = async (phone) => {
  const sessions = await readSessions();
  delete sessions[phone];
  await writeSessions(sessions);
};

module.exports = {
  getSession,
  updateSession,
  clearSession,
};
