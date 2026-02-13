import { Request, Response, NextFunction } from 'express';
import { PropertyService } from '../../domain/services/property.service';
import { CreatePropertyDto } from '../dtos/create-property.dto';
import { PropertyResponseDto, PropertySearchPaginatedResponseDto } from '../dtos/property-response.dto';

export class PropertyController {
  constructor(private propertyService: PropertyService) {}

  createProperty = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto: CreatePropertyDto = req.body;
      const property = await this.propertyService.addProperty(dto);
      
      const response: PropertyResponseDto = {
        id: property.id,
        address: property.address,
        suburb: property.suburb,
        state: property.state,
        postcode: property.postcode,
        salePrice: property.salePrice,
        description: property.description,
        createdAt: property.createdAt
      };
      
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };

  searchProperties = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const suburb = typeof req.query.suburb === 'string' ? req.query.suburb : undefined;
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;

      const result = await this.propertyService.searchProperties(suburb, page, limit);
      
      const response: PropertySearchPaginatedResponseDto = {
        properties: result.properties.map((p) => ({
          address: p.address,
          suburb: p.suburb,
          state: p.state,
          postcode: p.postcode,
          salePrice: p.salePrice,
          comparison: p.comparison,
          suburbAvg: p.suburbAvg
        })),
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages
        }
      };
      
      res.json(response);
    } catch (error) {
      next(error);
    }
  };
}
