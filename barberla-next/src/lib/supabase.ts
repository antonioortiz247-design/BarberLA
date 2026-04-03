import { createClient } from '@supabase/supabase-js';

const fallbackSupabaseUrl = 'https://krkazlphcjgkvcazbdlj.supabase.co';
const fallbackSupabaseAnonKey = 'sb_publishable_RD5mFKEHZkBp8KNv5B1Eng_3C3_Xi7k';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? fallbackSupabaseUrl;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? fallbackSupabaseAnonKey;

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn(
    'Using fallback Supabase public config. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel project env vars.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
