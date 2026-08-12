import { createClient } from "@supabase/supabase-js";

// Browser / client-side client — safe to use in components.
// Respects Row Level Security, so clients only ever see their own data.
export function createBrowserSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Server-side admin client — ONLY use inside API routes / server components
// that check for the trainer's own identity first. This bypasses RLS,
// so it can read/write every client's data. Never import this in
// anything that ships to the browser.
export function createAdminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// Simple admin check: is the logged-in user you (the trainer)?
export function isAdminEmail(email: string | null | undefined) {
  if (!email) return false;
  return email.toLowerCase() === (process.env.ADMIN_EMAIL || "").toLowerCase();
}
