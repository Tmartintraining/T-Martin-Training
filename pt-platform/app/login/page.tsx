"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const supabase = createBrowserSupabase();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
      return;
    }
    // Admin check happens server-side; the admin layout re-verifies,
    // so it's safe to just try /admin first and let it redirect if not you.
    if (email.toLowerCase() === process.env.NEXT_PUBLIC_ADMIN_EMAIL?.toLowerCase()) {
      router.push("/admin");
    } else {
      router.push("/portal");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 bg-brand-black">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm bg-white p-8 rounded-lg"
      >
        <div className="flex items-center gap-2 mb-6">
          <img src="/logo.png" alt="T Martin Training" className="w-10 h-10 rounded-full" />
          <span className="font-display font-semibold tracking-wide">T MARTIN TRAINING</span>
        </div>
        <h1 className="font-display italic font-semibold uppercase text-2xl mb-6">Log In</h1>
        {error && (
          <p className="text-red-600 text-sm mb-4 bg-red-50 p-2 rounded">
            {error}
          </p>
        )}
        <label className="block text-sm mb-1">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mb-4"
        />
        <label className="block text-sm mb-1">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mb-6"
        />
        <button
          type="submit"
          className="w-full bg-brand text-white py-2.5 font-semibold tracking-wide hover:bg-brand-dark transition"
        >
          LOG IN
        </button>
      </form>
    </main>
  );
}
