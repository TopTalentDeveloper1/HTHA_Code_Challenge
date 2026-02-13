import { Router } from 'express';
import { PropertyController } from '../controllers/property.controller';
import { validate } from '../middlewares/validation';
import { createPropertySchema } from '../dtos/create-property.dto';

/**
 * @swagger
 * /properties:
 *   post:
 *     summary: Add a new property
 *     tags: [Properties]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePropertyRequest'
 *           example:
 *             address: "12 George Street"
 *             suburb: "Bondi"
 *             state: "NSW"
 *             postcode: "2026"
 *             salePrice: 2850000
 *             description: "4 bedroom coastal home within walking distance to Bondi Beach"
 *     responses:
 *       201:
 *         description: Property created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PropertyResponse'
 *             example:
 *               id: "123e4567-e89b-12d3-a456-426614174000"
 *               address: "12 George Street"
 *               suburb: "bondi"
 *               state: "NSW"
 *               postcode: "2026"
 *               salePrice: 2850000
 *               description: "4 bedroom coastal home within walking distance to Bondi Beach"
 *               createdAt: "2025-01-27T10:00:00.000Z"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   get:
 *     summary: Search properties with optional suburb filter
 *     tags: [Properties]
 *     parameters:
 *       - in: query
 *         name: suburb
 *         schema:
 *           type: string
 *         description: Filter by suburb name (case-insensitive, optional)
 *         example: bondi
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 50
 *         description: Number of items per page
 *         example: 50
 *     responses:
 *       200:
 *         description: List of properties with price comparisons
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PropertySearchResponse'
 *             example:
 *               properties:
 *                 - address: "12 George Street"
 *                   suburb: "bondi"
 *                   state: "NSW"
 *                   postcode: "2026"
 *                   salePrice: 2850000
 *                   comparison: "above"
 *                   suburbAvg: 2500000
 *               pagination:
 *                 page: 1
 *                 limit: 50
 *                 total: 150
 *                 totalPages: 3
 *       400:
 *         description: Invalid pagination parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export const createPropertyRoutes = (controller: PropertyController): Router => {
  const router = Router();

  router.post('/', validate(createPropertySchema), controller.createProperty);
  router.get('/', controller.searchProperties);

  return router;
};
