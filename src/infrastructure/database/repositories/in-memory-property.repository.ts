import { Property, PropertyWithComparison } from '../../../domain/models/property';
import { PropertyRepository, SearchPropertiesResult } from '../../../domain/repositories/property.repository';
import { v4 as uuidv4 } from 'uuid';
import { getPriceComparison } from '../../../shared/utils/comparison';

export class InMemoryPropertyRepository implements PropertyRepository {
  private items: Property[] = [];

  async addProperty(p: Omit<Property, 'id' | 'createdAt'>): Promise<Property> {
    const created: Property = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      ...p
    };
    this.items.push(created);
    return created;
  }

  private computeSuburbAverages(): Record<string, number> {
    const map: Record<string, { sum: number; count: number }> = {};
    
    for (const property of this.items) {
      if (!map[property.suburb]) {
        map[property.suburb] = { sum: 0, count: 0 };
      }
      map[property.suburb].sum += property.salePrice;
      map[property.suburb].count += 1;
    }

    const averages: Record<string, number> = {};
    for (const suburb of Object.keys(map)) {
      averages[suburb] = map[suburb].sum / map[suburb].count;
    }
    
    return averages;
  }

  async searchProperties(
    suburb?: string,
    page: number = 1,
    limit: number = 50
  ): Promise<SearchPropertiesResult> {
    let candidates = suburb
      ? this.items.filter((p) => p.suburb === suburb)
      : this.items.slice();

    const total = candidates.length;
    const offset = (page - 1) * limit;
    const paginatedCandidates = candidates.slice(offset, offset + limit);
    const suburbAverages = this.computeSuburbAverages();

    const propertiesWithComparison: PropertyWithComparison[] = paginatedCandidates.map((p) => {
      const suburbAvg = suburbAverages[p.suburb] ?? p.salePrice;
      return {
        ...p,
        suburbAvg,
        comparison: getPriceComparison(p.salePrice, suburbAvg)
      };
    });

    const totalPages = Math.ceil(total / limit);

    return {
      properties: propertiesWithComparison,
      total,
      page,
      limit,
      totalPages
    };
  }
}
