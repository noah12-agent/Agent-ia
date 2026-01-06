# Agent-ia

Agent WhatsApp pour restaurant (Node.js + Express) avec réponses officielles et flux de réservation scripté.

## Démarrage rapide

```bash
npm install
cp .env.example .env
npm start
```

Le serveur écoute sur `PORT` (par défaut `3000`).

## Configuration Meta WhatsApp Cloud API

1. Créez une application Meta et activez WhatsApp Cloud API.
2. Récupérez :
   - `WHATSAPP_VERIFY_TOKEN` (token libre choisi par vous, doit correspondre au webhook).
   - `WHATSAPP_ACCESS_TOKEN` (token d'accès Cloud API).
   - `WHATSAPP_PHONE_NUMBER_ID` (ID du numéro WhatsApp).
   - `META_GRAPH_VERSION` (ex: `v20.0`).
3. Placez ces valeurs dans `.env`.
4. Configurez le webhook Meta :
   - URL : `https://<votre-domaine>/webhook`
   - Verify Token : `WHATSAPP_VERIFY_TOKEN`

## Exposer en HTTPS

Le webhook Meta nécessite un endpoint HTTPS public.

- **Ngrok** :
  ```bash
  ngrok http 3000
  ```
  Utilisez l’URL fournie comme base pour le webhook.

- **Hébergeur** : déployez sur un service (Render, Railway, Fly, etc.) avec HTTPS.

## Endpoints

- `GET /webhook` : vérification du webhook (`hub.mode`, `hub.verify_token`, `hub.challenge`).
- `POST /webhook` : réception des messages entrants WhatsApp.

## Tests manuels (curl)

### Vérification webhook

```bash
curl "http://localhost:3000/webhook?hub.mode=subscribe&hub.verify_token=YOUR_TOKEN&hub.challenge=CHALLENGE"
```

### Simulation de message entrant

```bash
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "entry": [{
      "changes": [{
        "value": {
          "messages": [{
            "from": "33600000000",
            "text": { "body": "menu" }
          }]
        }
      }]
    }]
  }'
```

## Tests unitaires

```bash
npm test
```

## Structure

```
src/
  app.js
  server.js
  routes/webhook.routes.js
  controllers/webhook.controller.js
  services/whatsapp.service.js
  services/agent.service.js
  services/intent.service.js
  storage/reservations.store.js
  storage/sessions.store.js
  data/restaurant.profile.json
  data/faq.intents.json
```

## Notes

- Les réponses FAQ et les informations officielles viennent exclusivement des fichiers dans `src/data/`.
- Le flux de réservation valide chaque entrée et demande une confirmation avant enregistrement.
