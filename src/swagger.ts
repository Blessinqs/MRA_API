import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import swaggerAutogen from 'swagger-autogen';
import dotenv from 'dotenv';
dotenv.config();

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API documentation for MRA application',
      license: {
        name: 'Licensed Under MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: 'Tcnozone IT Solutions Ltd',
        url: 'https://jsonplaceholder.typicode.com',
      }
    },
    servers: [
    {
      url: `https://mra-api.onrender.com`,
      description: 'RetailMax-MRA Server',
    },
    ],
    components: {
      schemas: {
        TerminalRequest: {
          type: 'object',
          properties: {
           tac : {
              type: 'string',
              example: 'AAYH-THDS-SRGT-9HGF',
              description: 'Activation process status'
            },
            osVersion: {
              type: 'string',
              example: 'Terminal Activated, pending for confirmation request',
              description: 'Human-readable status message'
            },
            osBuild: {
              type: 'string',
              example: 'Terminal Activated, pending for confirmation request',
              description: 'Human-readable status message'
            },
            macAddress: {
              type: 'string',
              example: '00-02-90-98-UT',
              description: 'Human-readable status message'
            },
            productId: {
              type: 'string',
              example: "CASH",
              description: 'Human-readable status message'
            },
            productVersion: {
              type: 'string',
              example: "CASH",
              description: 'Human-readable status message'
            }
          }
        },
        TerminalActivationResponse: {
          type: 'object',
          properties: {
            success : {
              type: 'boolean',
              example: true,
              description: 'Activation process successful'
            },
            remark: {
              type: 'string',
              example: 'Terminal Activated, pending for confirmation request',
              description: 'Human-readable status message'
            }
          }
        },
        InvoiceResponse:{
          type: 'object',
          properties: {
            remark: {
              type: 'string',
              example: 'Terminal Activated, pending for confirmation request',
              description: 'Human-readable status message'
            },
            validationURL: {
              type: 'string',
              example: 'Terminal Activated, pending for confirmation request',
              description: 'Human-readable status message'
            },
            offlineSignature: {
              type: 'string',
              example: 'Terminal Activated, pending for confirmation request',
              description: 'Human-readable status message'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success : {
              type: 'boolean',
              example: false,
              description: 'Activation process successful'
            },
            remark: {
              type: 'string',
              example: 'Terminal Activated, pending for confirmation request',
              description: 'Human-readable status message'
            }
          }
        },
        InvoiceRequest: {
          type: 'object',
          properties: {
            tac: {
              type: 'string',
              example: 'AAYH-THDS-SRGT-9HGF',
              description: 'Activation process status'
            },
            buyerTin: {
              type: 'string',
              example: 'Terminal Activated, pending for confirmation request',
              description: 'Human-readable status message'
            },
            buyerName: {
              type: 'string',
              example: 'Terminal Activated, pending for confirmation request',
              description: 'Human-readable status message'
            },
            count: {
              type: 'integer',
              example: 0,
              description: 'Human-readable status message'
            },
            date: {
              type: 'string',
              example: '12-06-2025',
              description: 'Human-readable status message'
            },
            offline: {
              type: 'boolean',
              example: true,
              description: 'True or False'
            },
            paymentMethod: {
              type: 'string',
              example: "CASH",
              description: 'Human-readable status message'
            }
          }
        },
      },
    }
  },
  apis: ['./src/routes/*.ts'], // files containing annotations
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app: Express, port: number) {
  // Swagger page
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Docs in JSON format
  app.get('/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
}

export default swaggerDocs;
