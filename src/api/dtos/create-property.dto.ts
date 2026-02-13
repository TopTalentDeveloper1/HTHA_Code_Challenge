import { z } from 'zod';

export const createPropertySchema = z.object({
  address: z.string().min(1, 'Address is required'),
  suburb: z.string().min(1, 'Suburb is required'),
  state: z.string().optional(),
  postcode: z.string().optional(),
  salePrice: z.number().positive('Sale price must be positive'),
  description: z.string().optional()
});

export type CreatePropertyDto = z.infer<typeof createPropertySchema>;
