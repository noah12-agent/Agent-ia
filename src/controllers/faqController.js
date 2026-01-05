const faq = [
  {
    question: "Quels sont vos horaires ?",
    answer: "Nous sommes ouverts du mardi au dimanche, de 12h à 14h30 et de 19h à 22h30."
  },
  {
    question: "Quelle est votre adresse ?",
    answer: "12 rue des Saveurs, 75002 Paris."
  },
  {
    question: "Proposez-vous la livraison ?",
    answer: "Oui, via nos partenaires Uber Eats et Deliveroo."
  },
  {
    question: "Quels moyens de paiement acceptez-vous ?",
    answer: "Carte bancaire, espèces, tickets restaurant et Apple Pay."
  },
  {
    question: "Pouvez-vous partager un aperçu du menu ?",
    answer: "Entrées, plats et desserts de saison, avec options végétariennes chaque jour."
  }
];

const getFaq = (_req, res) => {
  res.json({ data: faq });
};

module.exports = {
  getFaq
};
