Supabase setup steps

1) Create a Supabase project at https://app.supabase.com

2) In the Supabase Project → Settings → API
   - Copy the `URL` and the `anon public` key.

3) Locally, set the keys into your project safely by running:

```bash
SUPABASE_URL="https://your-project.supabase.co" SUPABASE_ANON_KEY="ey..." node scripts/set-supabase-keys.js
```

This will write `assets/supabase.js` with the provided keys. Do NOT commit that file with real keys.

4) Run SQL setup in Supabase SQL editor. Open SQL Editor and run the following files in order:
   - `supabase_schema.sql` (creates tables, trigger, sample data)
   - `supabase_policies.sql` (adds RLS policies)

5) Deploy & test:
   - Ensure your pages load the Supabase JS CDN before your module scripts, e.g. in HTML:

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script type="module" src="assets/supabase.js"></script>
```

7) Security notes:
   - Add CAPTCHA for public contact form inserts or require email confirmation.
   - Rotate anon keys if leaked.
