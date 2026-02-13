-- migration: create properties table
CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY,
  address text NOT NULL,
  suburb text NOT NULL,
  sale_price numeric NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);
