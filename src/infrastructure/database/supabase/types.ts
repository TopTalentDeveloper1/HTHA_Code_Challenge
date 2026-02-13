/**
 * Type definitions for Supabase database rows
 * This improves type safety by avoiding 'any' types
 */

export interface SupabasePropertyRow {
  id: string;
  address: string;
  suburb: string;
  state: string | null;
  postcode: string | null;
  sale_price: number | string; // Can be string from DB, converted to number
  description: string | null;
  created_at: string;
}

export interface SupabaseSuburbAverageRow {
  suburb: string;
  avg_price: number;
  property_count: number;
}
