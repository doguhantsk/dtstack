// Supabase client wrapper
// WARNING: Do NOT commit real keys to source control. Use the helper script
// `scripts/set-supabase-keys.js` or fill these values locally before deploying.

const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

// This file expects the Supabase JS lib to be loaded (e.g. via CDN in your HTML)
// so that `supabase.createClient` is available. It exports `supabase` and
// also sets a global `_supabase` for inline scripts that reference it.
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
export const supabase = supabaseClient;
window._supabase = supabaseClient;