import { Property, PropertyWithComparison } from '../../../domain/models/property';
import { PropertyRepository, SearchPropertiesResult } from '../../../domain/repositories/property.repository';
import { supabase } from '../supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseError } from '../../../shared/errors/database-error';
import { SupabasePropertyRow } from '../supabase/types';
import { getPriceComparison } from '../../../shared/utils/comparison';

export class SupabasePropertyRepository implements PropertyRepository {
  private table = 'properties';

  async addProperty(p: Omit<Property, 'id' | 'createdAt'>): Promise<Property> {
    const payload = {
      id: uuidv4(),
      address: p.address,
      suburb: p.suburb,
      state: p.state || null,
      postcode: p.postcode || null,
      sale_price: p.salePrice,
      description: p.description || null
    };

    const { data, error } = await supabase
      .from(this.table)
      .insert(payload)
      .select('*')
      .single();

    if (error) {
      throw new DatabaseError('Failed to insert property', error);
    }

    return this.mapRowToProperty(data as SupabasePropertyRow);
  }

  async searchProperties(
    suburb?: string,
    page: number = 1,
    limit: number = 50
  ): Promise<SearchPropertiesResult> {
    const offset = (page - 1) * limit;
    const shouldFilter = suburb !== undefined && suburb !== null && typeof suburb === 'string' && suburb.trim().length > 0;
    const filterValue = shouldFilter ? suburb.trim() : undefined;

    let query = supabase
      .from(this.table)
      .select('id, address, suburb, state, postcode, sale_price, description, created_at', { count: 'exact' });

    if (shouldFilter && filterValue) {
      query = query.eq('suburb', filterValue);
    }

    query = query.range(offset, offset + limit - 1);
    const { data, error, count } = await query;

    if (error) {
      throw new DatabaseError('Failed to search properties', error);
    }

    const properties: Property[] = (data || []).map((row) =>
      this.mapRowToProperty(row as SupabasePropertyRow)
    );

    if (properties.length === 0) {
      return {
        properties: [],
        total: count || 0,
        page,
        limit,
        totalPages: 0
      };
    }

    const uniqueSuburbs = [...new Set(properties.map((p) => p.suburb))];
    const suburbAverages = await this.getSuburbAverages(uniqueSuburbs);

    const propertiesWithComparison: PropertyWithComparison[] = properties.map((p) => {
      const suburbAvg = suburbAverages[p.suburb] ?? p.salePrice;
      return {
        ...p,
        suburbAvg,
        comparison: getPriceComparison(p.salePrice, suburbAvg)
      };
    });

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    return {
      properties: propertiesWithComparison,
      total,
      page,
      limit,
      totalPages
    };
  }

  private async getSuburbAverages(suburbs: string[]): Promise<Record<string, number>> {
    if (suburbs.length === 0) {
      return {};
    }

    const { data, error } = await supabase
      .from(this.table)
      .select('suburb, sale_price')
      .in('suburb', suburbs);

    if (error) {
      throw new DatabaseError('Failed to calculate suburb averages', error);
    }

    const suburbStats: Record<string, { sum: number; count: number }> = {};
    
    (data || []).forEach((row: { suburb: string; sale_price: number | string }) => {
      const suburb = row.suburb;
      const price = Number(row.sale_price);
      
      if (!suburbStats[suburb]) {
        suburbStats[suburb] = { sum: 0, count: 0 };
      }
      
      suburbStats[suburb].sum += price;
      suburbStats[suburb].count += 1;
    });

    const averages: Record<string, number> = {};
    Object.keys(suburbStats).forEach((suburb) => {
      averages[suburb] = suburbStats[suburb].sum / suburbStats[suburb].count;
    });

    return averages;
  }

  private mapRowToProperty(row: SupabasePropertyRow): Property {
    return {
      id: row.id,
      address: row.address,
      suburb: row.suburb,
      state: row.state ?? undefined,
      postcode: row.postcode ?? undefined,
      salePrice: Number(row.sale_price),
      description: row.description ?? undefined,
      createdAt: row.created_at
    };
  }
}
