import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { PropertyController } from './api/controllers/property.controller';
import { createPropertyRoutes } from './api/routes/property.routes';
import { errorHandler } from './api/middlewares/errorHandler';
import { requestLogger } from './api/middlewares/requestLogger';
import { requestId } from './api/middlewares/requestId';
import { swaggerSpec } from './api/docs/swagger';

export const createApp = (propertyController: PropertyController) => {
  const app = express();

  app.use(requestId);
  app.use(express.json());
  app.use(requestLogger);

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Property Listing API Documentation',
  }));

  /**
   * @swagger
   * /health:
   *   get:
   *     summary: Health check endpoint
   *     tags: [Health]
   *     responses:
   *       200:
   *         description: Service is healthy
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 ok:
   *                   type: boolean
   *                   example: true
   */
  app.get('/health', (req, res) => res.json({ ok: true }));
  app.use('/properties', createPropertyRoutes(propertyController));

  app.use(errorHandler);

  return app;
};

