# Backend Agent IA de Restaurant

API Node.js + Express pour gérer une FAQ, les réservations et un mini panneau admin.

## Pré-requis

- Node.js 18+
- npm

## Installation

```bash
npm install
```

## Variables d'environnement

Copiez `.env.example` en `.env` et adaptez si besoin :

- `PORT` : port HTTP du serveur (défaut 3000).
- `DATA_FILE` : chemin vers le fichier JSON de stockage local des réservations.

## Lancer le projet

- Mode développement (nodemon) :

```bash
npm run dev
```

- Mode production :

```bash
npm start
```

La documentation Swagger est disponible sur : `http://localhost:3000/docs`.

## Exemples de requêtes (curl)

### FAQ

```bash
curl http://localhost:3000/faq
```

### Créer une réservation

```bash
curl -X POST http://localhost:3000/reservations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Marie Curie",
    "phone": "+33123456789",
    "date": "2024-10-12",
    "time": "19:30",
    "people": 2,
    "note": "Table près de la fenêtre"
  }'
```

### Lister les réservations (admin)

```bash
curl http://localhost:3000/admin/reservations
```

### Mettre à jour un statut (admin)

```bash
curl -X PATCH http://localhost:3000/admin/reservations/<reservation_id>/status \
  -H "Content-Type: application/json" \
  -d '{ "status": "confirmed" }'
```

## Tests

```bash
npm test
```
