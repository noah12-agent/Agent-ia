const { detectIntent } = require('../src/services/intent.service');

describe('intent.service', () => {
  test('detects reservation intent', () => {
    const intent = detectIntent('Je veux réserver une table');
    expect(intent.type).toBe('reservation');
  });

  test('detects FAQ intent', () => {
    const intent = detectIntent('Pouvez-vous partager le menu ?');
    expect(intent.type).toBe('faq');
    expect(intent.key).toBe('menu');
  });

  test('detects human intent', () => {
    const intent = detectIntent('Je veux parler à un humain');
    expect(intent.type).toBe('human');
  });
});
