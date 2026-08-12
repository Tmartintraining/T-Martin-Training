# Your PT Business Platform

A custom website with:
- Public landing page + client signup
- Client portal (program viewing + check-in logging)
- Trainer dashboard (client list, program builder, check-in calendar)
- Square recurring monthly billing

Everything below is free to set up (Supabase, Vercel, and Square all have
free tiers that comfortably cover a solo trainer's client list). Square
takes its normal transaction fee per payment — that's the only real cost.

---

## 1. Create your accounts (10-15 min)

1. **Supabase** — https://supabase.com → New Project (free tier)
2. **Square Developer account** — https://developer.squareup.com → New Application
3. **Vercel** — https://vercel.com (for free hosting/deployment)

## 2. Set up the database

1. In Supabase, go to **SQL Editor**
2. Open `supabase/schema.sql` from this project, paste the whole thing in, click **Run**
3. Go to **Authentication > Providers**, make sure Email is enabled
4. Go to **Project Settings > API** and copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

## 3. Set up Square

1. In the Square Developer Dashboard, open your app → **Sandbox** tab first (test mode)
2. Copy the **Sandbox Access Token** → `SQUARE_ACCESS_TOKEN`
3. Copy your **Application ID** → `NEXT_PUBLIC_SQUARE_APP_ID`
4. Go to **Locations**, copy your Location ID → both `NEXT_PUBLIC_SQUARE_LOCATION_ID` and `SQUARE_LOCATION_ID`
5. In your real Square Dashboard (squareup.com, not developer), go to **Subscriptions > Plans**,
   create a monthly plan (e.g. "Coaching Membership - $150/mo"), and copy its
   **plan variation ID** → `SQUARE_PLAN_VARIATION_ID`
6. Under **Webhooks** in the Developer Dashboard, add an endpoint pointing to
   `https://yourdomain.com/api/square/webhook` (you'll fill this in after deploying),
   subscribe to the `subscription.updated` event, and copy the **Signature Key** →
   `SQUARE_WEBHOOK_SIGNATURE_KEY`

When you're ready to accept real payments, repeat steps 2-4 using your
**Production** credentials instead of Sandbox, and set `SQUARE_ENV=production`.

## 4. Configure your admin login

Set `NEXT_PUBLIC_ADMIN_EMAIL` and `ADMIN_EMAIL` to the email address you'll
log in with as the trainer. Then create that account by signing up through
Supabase Authentication > Users > Add User (do this manually, not through
the client signup form, so you skip the Square card step).

## 5. Run it locally

```bash
npm install
cp .env.example .env.local   # then fill in all the values above
npm run dev
```

Visit http://localhost:3000

## 6. Deploy for free

1. Push this project to a GitHub repo
2. In Vercel, click **Add New Project**, import the repo
3. Add all the same environment variables from `.env.local` in Vercel's
   Environment Variables settings
4. Deploy — Vercel gives you a free `yourproject.vercel.app` URL
   (you can add a custom domain later, domains are the one piece that
   typically costs a few dollars a year)
5. Go back to Square's webhook settings and update the URL to your real
   deployed domain

## Notes on what's here vs. what to build next

This gives you a fully working core: signup + billing, program assignment
(template or custom), and check-in scheduling/logging. Reasonable next
additions once this is live: photo uploads for progress pics, in-app
messaging, email/SMS reminders before check-ins, and a richer structured
program builder (sets/reps/weeks as real form fields instead of free text).
Happy to build any of these next — just ask.
