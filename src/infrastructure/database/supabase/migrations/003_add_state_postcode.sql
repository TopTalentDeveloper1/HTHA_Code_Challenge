-- Migration: Add state and postcode columns to properties table
-- These fields are optional to maintain backward compatibility

ALTER TABLE properties
ADD COLUMN IF NOT EXISTS state text,
ADD COLUMN IF NOT EXISTS postcode text;

-- Optional: Add index on state for filtering (if needed in future)
-- CREATE INDEX IF NOT EXISTS idx_properties_state ON properties(state);

-- Optional: Add index on postcode for filtering (if needed in future)
-- CREATE INDEX IF NOT EXISTS idx_properties_postcode ON properties(postcode);
