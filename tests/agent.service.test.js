const fs = require('fs').promises;
const path = require('path');
const { handleIncomingMessage } = require('../src/services/agent.service');

const sessionsPath = path.join(__dirname, '..', 'src', 'storage', 'sessions.json');
const reservationsPath = path.join(__dirname, '..', 'src', 'storage', 'reservations.json');

const resetStorage = async () => {
  await fs.writeFile(sessionsPath, JSON.stringify({}, null, 2));
  await fs.writeFile(reservationsPath, JSON.stringify([], null, 2));
};

describe('agent.service', () => {
  beforeEach(async () => {
    await resetStorage();
  });

  test('responds to menu FAQ with human option', async () => {
    const response = await handleIncomingMessage('123', 'menu');
    expect(response).toMatch(/menu/i);
    expect(response).toMatch(/Parler à un humain/);
  });

  test('handles reservation flow end-to-end', async () => {
    let response = await handleIncomingMessage('123', 'Je veux réserver');
    expect(response).toMatch(/Quel est votre nom/);

    response = await handleIncomingMessage('123', 'Jean Dupont');
    expect(response).toMatch(/date/);

    response = await handleIncomingMessage('123', '2025-01-12');
    expect(response).toMatch(/heure/);

    response = await handleIncomingMessage('123', '19:30');
    expect(response).toMatch(/Combien de personnes/);

    response = await handleIncomingMessage('123', '4');
    expect(response).toMatch(/notes/i);

    response = await handleIncomingMessage('123', 'Anniversaire');
    expect(response).toMatch(/Je récapitule/);

    response = await handleIncomingMessage('123', 'oui');
    expect(response).toMatch(/confirmons bientôt/);
  });
});
