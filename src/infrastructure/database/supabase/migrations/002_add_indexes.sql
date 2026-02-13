-- Migration: Add indexes for performance optimization
-- These indexes are critical for scaling to millions of properties

-- Index on suburb for fast filtering
CREATE INDEX IF NOT EXISTS idx_properties_suburb ON properties(suburb);

-- Composite index for suburb + price queries (useful for sorting/filtering)
CREATE INDEX IF NOT EXISTS idx_properties_suburb_price ON properties(suburb, sale_price);

-- Index on created_at for time-based queries (optional but recommended)
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON properties(created_at);
