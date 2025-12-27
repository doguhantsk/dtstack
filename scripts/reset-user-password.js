#!/usr/bin/env node
// Usage:
// SERVICE_ROLE_KEY="..." SUPABASE_URL="https://your.supabase.co" node scripts/reset-user-password.js --email user@example.com --password "NewPass123!"
// Or by id:
// SERVICE_ROLE_KEY="..." SUPABASE_URL="https://your.supabase.co" node scripts/reset-user-password.js --id <USER_UUID> --password "NewPass123!"

const { createClient } = require('@supabase/supabase-js');

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {};
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--email') out.email = args[++i];
    else if (a === '--id') out.id = args[++i];
    else if (a === '--password') out.password = args[++i];
  }
  return out;
}

async function main() {
  const { email, id, password } = parseArgs();
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SERVICE_ROLE_KEY = process.env.SERVICE_ROLE_KEY;

  if (!SERVICE_ROLE_KEY || !SUPABASE_URL) {
    console.error('Set SERVICE_ROLE_KEY and SUPABASE_URL environment variables.');
    process.exit(1);
  }
  if (!password) {
    console.error('Provide --password "NewPass123!"');
    process.exit(1);
  }

  const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false }
  });

  let userId = id;
  try {
    if (!userId) {
      if (!email) throw new Error('Provide --email or --id');
      // Find user id from profiles table
      const { data: profile, error: pErr } = await supabaseAdmin.from('profiles').select('id').eq('email', email).maybeSingle();
      if (pErr) throw pErr;
      if (!profile || !profile.id) throw new Error('User not found in public.profiles for email: ' + email);
      userId = profile.id;
    }

    console.log('Resetting password for user id:', userId);
    // Use admin API to update user's password
    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, { password });
    if (error) {
      console.error('Error updating password:', error);
      process.exit(2);
    }

    console.log('Password updated successfully. The user can now log in with the new password.');
  } catch (err) {
    console.error('Failed:', err.message || err);
    process.exit(3);
  }
}

main();
