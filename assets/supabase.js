// assets/supabase.js (template)
// Fill SUPABASE_URL and SUPABASE_ANON_KEY with your project's values.

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// --- REPLACE THESE ---
const SUPABASE_URL = 'https://YOUR_SUPABASE_PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY_HERE';
// ----------------------

if (SUPABASE_URL.includes('YOUR_SUPABASE_PROJECT') || SUPABASE_ANON_KEY.includes('YOUR_SUPABASE_ANON_KEY')) {
  console.warn('assets/supabase.js: please set SUPABASE_URL and SUPABASE_ANON_KEY');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
