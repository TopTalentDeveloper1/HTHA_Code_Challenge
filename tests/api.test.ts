import request from 'supertest';
import { createApp } from '../src/app';
import { PropertyService } from '../src/domain/services/property.service';
import { PropertyController } from '../src/api/controllers/property.controller';
import { InMemoryPropertyRepository } from '../src/infrastructure/database/repositories/in-memory-property.repository';

describe('API integration', () => {
  const repo = new InMemoryPropertyRepository();
  const service = new PropertyService(repo);
  const controller = new PropertyController(service);
  const app = createApp(controller);

  it('POST and GET properties with comparisons and pagination', async () => {
    await request(app)
      .post('/properties')
      .send({ address: '1 A St', suburb: 'X', salePrice: 100, description: '' })
      .expect(201);

    await request(app)
      .post('/properties')
      .send({ address: '2 B St', suburb: 'X', salePrice: 300, description: '' })
      .expect(201);

    const res = await request(app).get('/properties?suburb=x').expect(200);
    
    // Check response structure
    expect(res.body).toHaveProperty('properties');
    expect(res.body).toHaveProperty('pagination');
    expect(Array.isArray(res.body.properties)).toBe(true);
    expect(res.body.properties.length).toBe(2);
    
    // Check pagination metadata
    expect(res.body.pagination).toEqual({
      page: 1,
      limit: 50,
      total: 2,
      totalPages: 1
    });
    
    // Check properties
    const prices = res.body.properties.map((r: any) => r.salePrice).sort((a: number, b: number) => a - b);
    expect(prices).toEqual([100, 300]);
    
    // Check comparison fields
    expect(res.body.properties[0]).toHaveProperty('comparison');
    expect(res.body.properties[0]).toHaveProperty('suburbAvg');
  });

  it('handles pagination query parameters', async () => {
    // Add multiple properties
    for (let i = 1; i <= 5; i++) {
      await request(app)
        .post('/properties')
        .send({ address: `${i} St`, suburb: 'Pagination', salePrice: 100 * i, description: '' })
        .expect(201);
    }

    const res = await request(app)
      .get('/properties?suburb=pagination&page=1&limit=2')
      .expect(200);

    expect(res.body.properties).toHaveLength(2);
    expect(res.body.pagination.page).toBe(1);
    expect(res.body.pagination.limit).toBe(2);
    expect(res.body.pagination.total).toBe(5);
    expect(res.body.pagination.totalPages).toBe(3);
  });

  it('normalizes suburb names (case-insensitive)', async () => {
    await request(app)
      .post('/properties')
      .send({ address: '1 St', suburb: '  SYDNEY  ', salePrice: 100, description: '' })
      .expect(201);

    // Search with different case
    const res = await request(app)
      .get('/properties?suburb=sydney')
      .expect(200);

    expect(res.body.properties).toHaveLength(1);
    expect(res.body.properties[0].suburb).toBe('sydney');
  });

  it('handles state and postcode fields', async () => {
    const propertyData = {
      address: '12 George Street',
      suburb: 'Bondi',
      state: 'NSW',
      postcode: '2026',
      salePrice: 2850000,
      description: '4 bedroom coastal home within walking distance to Bondi Beach'
    };

    const createRes = await request(app)
      .post('/properties')
      .send(propertyData)
      .expect(201);

    // Check response includes state and postcode
    expect(createRes.body.state).toBe('NSW');
    expect(createRes.body.postcode).toBe('2026');

    // Search and verify state and postcode are returned
    const searchRes = await request(app)
      .get('/properties?suburb=bondi')
      .expect(200);

    expect(searchRes.body.properties).toHaveLength(1);
    expect(searchRes.body.properties[0].state).toBe('NSW');
    expect(searchRes.body.properties[0].postcode).toBe('2026');
  });

  it('handles properties without state and postcode (optional fields)', async () => {
    const propertyData = {
      address: '1 Test St',
      suburb: 'TestSuburb',
      salePrice: 100000,
      description: 'Test property'
    };

    const createRes = await request(app)
      .post('/properties')
      .send(propertyData)
      .expect(201);

    // Check response - state and postcode should be undefined/not present
    expect(createRes.body.state).toBeUndefined();
    expect(createRes.body.postcode).toBeUndefined();

    // Search and verify
    const searchRes = await request(app)
      .get('/properties?suburb=testsuburb')
      .expect(200);

    expect(searchRes.body.properties).toHaveLength(1);
    expect(searchRes.body.properties[0].state).toBeUndefined();
    expect(searchRes.body.properties[0].postcode).toBeUndefined();
  });

  it('normalizes state to uppercase', async () => {
    const propertyData = {
      address: '1 Test St',
      suburb: 'Test',
      state: 'nsw', // lowercase
      postcode: '2000',
      salePrice: 100000
    };

    const res = await request(app)
      .post('/properties')
      .send(propertyData)
      .expect(201);

    // State should be normalized to uppercase
    expect(res.body.state).toBe('NSW');
  });

  it('returns empty results for non-existent suburb', async () => {
    const res = await request(app)
      .get('/properties?suburb=nonexistent')
      .expect(200);

    expect(res.body.properties).toHaveLength(0);
    expect(res.body.pagination.total).toBe(0);
  });

  it('validates request body', async () => {
    await request(app)
      .post('/properties')
      .send({ address: '', suburb: 'Test', salePrice: 100 })
      .expect(400);

    await request(app)
      .post('/properties')
      .send({ address: 'Test', suburb: 'Test', salePrice: -100 })
      .expect(400);
  });

  it('includes request ID in error responses', async () => {
    const res = await request(app)
      .post('/properties')
      .send({ invalid: 'data' })
      .expect(400);

    expect(res.headers['x-request-id']).toBeDefined();
    expect(res.body.requestId).toBeDefined();
  });
});

