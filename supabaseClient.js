import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

// Muat variabel lingkungan
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Periksa apakah variabel ada
if (!supabaseUrl || !supabaseKey) {
  console.error(
    'Error: Missing SUPABASE_URL or SUPABASE_KEY environment variables.'
  );
  process.exit(1); // Keluar jika variabel tidak diset
}

// Ekspor klien Supabase yang telah diinisialisasi
export const supabase = createClient(supabaseUrl, supabaseKey);