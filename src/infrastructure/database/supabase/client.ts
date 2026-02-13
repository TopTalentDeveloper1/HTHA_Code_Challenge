import { createClient } from '@supabase/supabase-js';
import { config } from '../../../config';

const { url, key } = config.supabase;

if (!url || !key) {
  throw new Error('Supabase URL and KEY are required. Please set SUPABASE_URL and SUPABASE_KEY environment variables.');
}

export const supabase = createClient(url, key);
