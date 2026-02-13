import swaggerJsdoc from 'swagger-jsdoc';
import { config } from '../../config';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Property Listing API',
      version: '1.0.0',
      description: 'API for adding and searching properties for sale with suburb-based price comparisons',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.port}`,
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Property: {
          type: 'object',
          required: ['address', 'suburb', 'salePrice'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique property identifier',
            },
            address: {
              type: 'string',
              description: 'Property address',
              example: '12 George Street',
            },
            suburb: {
              type: 'string',
              description: 'Suburb name (normalized to lowercase)',
              example: 'bondi',
            },
            state: {
              type: 'string',
              description: 'State abbreviation (optional)',
              example: 'NSW',
            },
            postcode: {
              type: 'string',
              description: 'Postcode (optional)',
              example: '2026',
            },
            salePrice: {
              type: 'number',
              description: 'Sale price in dollars',
              example: 2850000,
            },
            description: {
              type: 'string',
              description: 'Property description (optional)',
              example: '4 bedroom coastal home within walking distance to Bondi Beach',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Property creation timestamp',
            },
          },
        },
        CreatePropertyRequest: {
          type: 'object',
          required: ['address', 'suburb', 'salePrice'],
          properties: {
            address: {
              type: 'string',
              minLength: 1,
              description: 'Property address',
              example: '12 George Street',
            },
            suburb: {
              type: 'string',
              minLength: 1,
              description: 'Suburb name',
              example: 'Bondi',
            },
            state: {
              type: 'string',
              description: 'State abbreviation (optional)',
              example: 'NSW',
            },
            postcode: {
              type: 'string',
              description: 'Postcode (optional)',
              example: '2026',
            },
            salePrice: {
              type: 'number',
              minimum: 0.01,
              description: 'Sale price in dollars (must be positive)',
              example: 2850000,
            },
            description: {
              type: 'string',
              description: 'Property description (optional)',
              example: '4 bedroom coastal home within walking distance to Bondi Beach',
            },
          },
        },
        PropertyResponse: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            address: {
              type: 'string',
            },
            suburb: {
              type: 'string',
            },
            state: {
              type: 'string',
              nullable: true,
            },
            postcode: {
              type: 'string',
              nullable: true,
            },
            salePrice: {
              type: 'number',
            },
            description: {
              type: 'string',
              nullable: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        PropertySearchItem: {
          type: 'object',
          properties: {
            address: {
              type: 'string',
              example: '12 George Street',
            },
            suburb: {
              type: 'string',
              example: 'bondi',
            },
            state: {
              type: 'string',
              nullable: true,
              example: 'NSW',
            },
            postcode: {
              type: 'string',
              nullable: true,
              example: '2026',
            },
            salePrice: {
              type: 'number',
              example: 2850000,
            },
            comparison: {
              type: 'string',
              enum: ['above', 'below', 'equal'],
              description: 'Price comparison relative to suburb average',
              example: 'above',
            },
            suburbAvg: {
              type: 'number',
              description: 'Average sale price for the suburb',
              example: 2500000,
            },
          },
        },
        Pagination: {
          type: 'object',
          properties: {
            page: {
              type: 'number',
              description: 'Current page number',
              example: 1,
            },
            limit: {
              type: 'number',
              description: 'Number of items per page',
              example: 50,
            },
            total: {
              type: 'number',
              description: 'Total number of properties matching the query',
              example: 150,
            },
            totalPages: {
              type: 'number',
              description: 'Total number of pages',
              example: 3,
            },
          },
        },
        PropertySearchResponse: {
          type: 'object',
          properties: {
            properties: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/PropertySearchItem',
              },
            },
            pagination: {
              $ref: '#/components/schemas/Pagination',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'error',
            },
            message: {
              type: 'string',
              example: 'Validation failed',
            },
            requestId: {
              type: 'string',
              description: 'Unique request identifier for tracing',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
            details: {
              type: 'array',
              items: {
                type: 'object',
              },
              description: 'Validation error details (if applicable)',
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Properties',
        description: 'Property management endpoints',
      },
      {
        name: 'Health',
        description: 'Health check endpoint',
      },
    ],
  },
  apis: ['./src/api/routes/*.ts', './src/api/controllers/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
