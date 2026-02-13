# HTHA Property Listing API

Production-ready TypeScript + Node.js + Express + Supabase API for property listings.

## 🏗️ Architecture Overview

This project follows **Clean Architecture** / **Domain-Driven Design** principles with clear separation of concerns.

```
src/
├── main.ts                          # Bootstrap & DI container
├── app.ts                           # Express app factory
├── config/                          # Configuration
├── api/                             # HTTP layer
│   ├── controllers/                 # Request handlers (thin)
│   ├── routes/                      # Route registration
│   ├── middlewares/                 # Error handling, logging, validation
│   ├── dtos/                        # Request/response schemas (zod)
│   └── docs/                        # API documentation (Swagger)
├── domain/                          # Core business logic (framework-agnostic)
│   ├── models/                      # Domain entities
│   ├── services/                    # Use-cases
│   └── repositories/                # Repository interfaces
├── infrastructure/                  # External dependencies
│   └── database/
│       ├── supabase/                # Client & migrations
│       └── repositories/            # Concrete implementations
├── shared/                          # Cross-cutting concerns
│   ├── errors/                      # Custom error classes
│   └── utils/
└── tests/                           # Unit & integration tests
```

## ✨ Features

### API Endpoints
- `POST /properties` - Add property (address, suburb, state, postcode, salePrice, description)
- `GET /properties?suburb=<name>&page=<num>&limit=<num>` - Search with optional suburb filter and pagination
  - Returns: address, suburb, state, postcode, salePrice, comparison ('above'|'below'|'equal' vs suburb avg), suburbAvg
- `GET /health` - Health check endpoint
- `GET /api-docs` - Interactive Swagger API documentation

### Production-Ready
- ✅ Layered architecture (API / Domain / Infrastructure)
- ✅ Dependency injection (explicit wiring)
- ✅ Request validation (Zod schemas)
- ✅ Error handling (centralized middleware)
- ✅ Request logging (method, URL, status, duration)
- ✅ Repository pattern (swappable implementations)
- ✅ Type safety (end-to-end TypeScript + DTOs)
- ✅ Testing (unit + integration)
- ✅ Database migrations (SQL for Supabase)
- ✅ API documentation (Swagger/OpenAPI)

## 🚀 Quick Start

```powershell
# Install
npm install

# Configure environment variables (required)
# Create .env file with:
# SUPABASE_URL=your_supabase_url
# SUPABASE_KEY=your_supabase_key
# PORT=3000 (optional, defaults to 3000)

# Run database migrations in Supabase SQL Editor
# See: src/infrastructure/database/supabase/migrations/

# Dev
npm run dev

# Test
npm test

# Build
npm run build
npm start

# Access API Documentation
# After starting the server, visit: http://localhost:3000/api-docs
```

## 📁 Key Design Decisions

1. **Clean Architecture** - Domain logic independent of frameworks
2. **Dependency Injection** - Explicit wiring in main.ts
3. **Error Handling** - Custom error classes + centralized middleware
4. **Validation** - Zod schemas (runtime + compile-time safety)
5. **Repository Pattern** - Interface in domain, implementations in infrastructure

## ⚡ Scalability (Millions of Properties)

- Use DB-side aggregates (SQL GROUP BY or materialized views)
- Add indexes: `CREATE INDEX idx_properties_suburb ON properties(suburb);`
- Implement pagination (cursor-based or offset)
- Cache suburb averages (Redis)
- Partition table by suburb or date
- Use read replicas for queries

## 🛠️ Tech Stack

- Node.js 18+, TypeScript 5+, Express 4
- Supabase (PostgreSQL)
- Zod (validation), Jest + Supertest (testing)

