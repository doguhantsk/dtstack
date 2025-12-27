#!/usr/bin/env node
// Simple check script to verify Supabase REST access using anon key.
// Usage:
// SUPABASE_URL="https://your-project.supabase.co" SUPABASE_ANON_KEY="ey..." node scripts/check-supabase.js

const https = require('https');
const { URL } = require('url');

const base = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_ANON_KEY;
if (!base || !key) {
  console.error('Please set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.');
  process.exit(1);
}

const u = new URL('/rest/v1/projects?select=id,title&limit=1', base);

const options = {
  method: 'GET',
  headers: {
    apikey: key,
    Authorization: `Bearer ${key}`,
    Accept: 'application/json'
  }
};

const req = https.request(u, options, (res) => {
  let body = '';
  res.on('data', (d) => body += d);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    try {
      const json = JSON.parse(body || 'null');
      console.log('Response:', json);
    } catch (e) {
      console.log('Raw response:', body);
    }
  });
});
req.on('error', (e) => console.error('Request error', e));
req.end();
