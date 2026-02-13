import { Property, PropertyWithComparison } from '../models/property';
import { PropertyRepository, SearchPropertiesResult } from '../repositories/property.repository';
import { ValidationError } from '../../shared/errors/validation-error';
import { sanitizeString, sanitizeAndNormalizeSuburb } from '../../shared/utils/sanitize';

export class PropertyService {
  constructor(private repo: PropertyRepository) {}

  async addProperty(p: Omit<Property, 'id' | 'createdAt'>): Promise<Property> {
    if (!p.address || !p.suburb || !p.salePrice) {
      throw new ValidationError('address, suburb and salePrice required');
    }

    if (p.salePrice <= 0) {
      throw new ValidationError('salePrice must be positive');
    }

    const sanitizedProperty = {
      ...p,
      address: sanitizeString(p.address),
      suburb: sanitizeAndNormalizeSuburb(p.suburb),
      state: p.state ? sanitizeString(p.state).toUpperCase() : undefined,
      postcode: p.postcode ? sanitizeString(p.postcode) : undefined,
      description: p.description ? sanitizeString(p.description) : undefined,
      salePrice: p.salePrice
    };

    return this.repo.addProperty(sanitizedProperty);
  }

  async searchProperties(
    suburb?: string,
    page: number = 1,
    limit: number = 50
  ): Promise<SearchPropertiesResult> {
    if (page < 1) {
      throw new ValidationError('page must be greater than 0');
    }
    if (limit < 1 || limit > 100) {
      throw new ValidationError('limit must be between 1 and 100');
    }

    const normalizedSuburb = suburb ? sanitizeAndNormalizeSuburb(suburb) : undefined;
    return this.repo.searchProperties(normalizedSuburb, page, limit);
  }
}
