const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Restaurant AI Backend",
      version: "1.0.0",
      description: "API MVP pour un agent IA de restaurant"
    },
    servers: [{ url: "http://localhost:3000" }],
    components: {
      schemas: {
        Reservation: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            phone: { type: "string" },
            date: { type: "string", example: "2024-10-12" },
            time: { type: "string", example: "19:30" },
            people: { type: "integer", example: 2 },
            note: { type: "string" },
            status: { type: "string", example: "pending" },
            createdAt: { type: "string" },
            updatedAt: { type: "string" }
          }
        }
      }
    },
    paths: {
      "/faq": {
        get: {
          summary: "Liste des questions fréquentes",
          responses: {
            200: {
              description: "FAQ",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      data: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            question: { type: "string" },
                            answer: { type: "string" }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/reservations": {
        post: {
          summary: "Créer une réservation",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name", "phone", "date", "time", "people"],
                  properties: {
                    name: { type: "string" },
                    phone: { type: "string" },
                    date: { type: "string", example: "2024-10-12" },
                    time: { type: "string", example: "19:30" },
                    people: { type: "integer", example: 2 },
                    note: { type: "string" }
                  }
                }
              }
            }
          },
          responses: {
            201: {
              description: "Réservation créée",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      data: { $ref: "#/components/schemas/Reservation" }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/admin/reservations": {
        get: {
          summary: "Lister les réservations",
          responses: {
            200: {
              description: "Liste des réservations",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      data: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Reservation" }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/admin/reservations/{id}/status": {
        patch: {
          summary: "Mettre à jour le statut d'une réservation",
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" }
            }
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["status"],
                  properties: {
                    status: {
                      type: "string",
                      enum: ["pending", "confirmed", "cancelled"]
                    }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: "Réservation mise à jour",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      data: { $ref: "#/components/schemas/Reservation" }
                    }
                  }
                }
              }
            },
            404: {
              description: "Réservation introuvable"
            }
          }
        }
      }
    }
  },
  apis: []
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
