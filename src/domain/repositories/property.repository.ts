import { Property, PropertyWithComparison } from '../models/property';

export interface SearchPropertiesResult {
  properties: PropertyWithComparison[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PropertyRepository {
  addProperty(p: Omit<Property, 'id' | 'createdAt'>): Promise<Property>;
  searchProperties(
    suburb?: string,
    page?: number,
    limit?: number
  ): Promise<SearchPropertiesResult>;
}
