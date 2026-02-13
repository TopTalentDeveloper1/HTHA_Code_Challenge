import { PropertyService } from '../src/domain/services/property.service';
import { InMemoryPropertyRepository } from '../src/infrastructure/database/repositories/in-memory-property.repository';

describe('PropertyService', () => {
  it('adds and computes comparison correctly', async () => {
    const repo = new InMemoryPropertyRepository();
    const service = new PropertyService(repo);

    await service.addProperty({ address: '1 A St', suburb: 'Nice', salePrice: 100, description: '' });
    await service.addProperty({ address: '2 B St', suburb: 'Nice', salePrice: 200, description: '' });
    
    const result = await service.searchProperties('nice'); // Test normalization (lowercase)
    expect(result.properties).toHaveLength(2);
    expect(result.total).toBe(2);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(50);
    
    const avg = result.properties[0].suburbAvg;
    expect(avg).toBe(150);
    
    const above = result.properties.find((r) => r.salePrice === 200);
    const below = result.properties.find((r) => r.salePrice === 100);
    expect(above?.comparison).toBe('above');
    expect(below?.comparison).toBe('below');
  });

  it('normalizes suburb names to lowercase', async () => {
    const repo = new InMemoryPropertyRepository();
    const service = new PropertyService(repo);

    await service.addProperty({ address: '1 St', suburb: '  SYDNEY  ', salePrice: 100, description: '' });
    const result = await service.searchProperties('sydney');
    
    expect(result.properties).toHaveLength(1);
    expect(result.properties[0].suburb).toBe('sydney'); // Normalized
  });

  it('handles state and postcode fields', async () => {
    const repo = new InMemoryPropertyRepository();
    const service = new PropertyService(repo);

    const property = await service.addProperty({
      address: '12 George Street',
      suburb: 'Bondi',
      state: 'NSW',
      postcode: '2026',
      salePrice: 2850000,
      description: '4 bedroom coastal home'
    });

    expect(property.state).toBe('NSW');
    expect(property.postcode).toBe('2026');

    const result = await service.searchProperties('bondi');
    expect(result.properties[0].state).toBe('NSW');
    expect(result.properties[0].postcode).toBe('2026');
  });

  it('normalizes state to uppercase', async () => {
    const repo = new InMemoryPropertyRepository();
    const service = new PropertyService(repo);

    const property = await service.addProperty({
      address: '1 St',
      suburb: 'Test',
      state: 'nsw', // lowercase input
      postcode: '2000',
      salePrice: 100000
    });

    expect(property.state).toBe('NSW'); // Normalized to uppercase
  });

  it('handles pagination correctly', async () => {
    const repo = new InMemoryPropertyRepository();
    const service = new PropertyService(repo);

    // Add 5 properties
    for (let i = 1; i <= 5; i++) {
      await service.addProperty({
        address: `${i} St`,
        suburb: 'Test',
        salePrice: 100 * i,
        description: ''
      });
    }

    // First page
    const page1 = await service.searchProperties('test', 1, 2);
    expect(page1.properties).toHaveLength(2);
    expect(page1.total).toBe(5);
    expect(page1.page).toBe(1);
    expect(page1.totalPages).toBe(3);

    // Second page
    const page2 = await service.searchProperties('test', 2, 2);
    expect(page2.properties).toHaveLength(2);
    expect(page2.page).toBe(2);

    // Last page
    const page3 = await service.searchProperties('test', 3, 2);
    expect(page3.properties).toHaveLength(1);
    expect(page3.page).toBe(3);
  });

  it('validates pagination parameters', async () => {
    const repo = new InMemoryPropertyRepository();
    const service = new PropertyService(repo);

    await expect(service.searchProperties(undefined, 0, 50)).rejects.toThrow();
    await expect(service.searchProperties(undefined, 1, 0)).rejects.toThrow();
    await expect(service.searchProperties(undefined, 1, 101)).rejects.toThrow();
  });

  it('handles equal price comparison', async () => {
    const repo = new InMemoryPropertyRepository();
    const service = new PropertyService(repo);

    // Add properties with same price (average = price)
    await service.addProperty({ address: '1 St', suburb: 'Equal', salePrice: 100, description: '' });
    await service.addProperty({ address: '2 St', suburb: 'Equal', salePrice: 100, description: '' });
    
    const result = await service.searchProperties('equal');
    expect(result.properties[0].comparison).toBe('equal');
    expect(result.properties[1].comparison).toBe('equal');
  });
});

