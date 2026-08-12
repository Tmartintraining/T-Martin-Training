"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { createBrowserSupabase } from "@/lib/supabase";

declare global {
  interface Window {
    Square: any;
  }
}

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);
  const cardRef = useRef<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (!sdkReady || !window.Square) return;
    (async () => {
      const payments = window.Square.payments(
        process.env.NEXT_PUBLIC_SQUARE_APP_ID,
        process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID
      );
      const card = await payments.card();
      await card.attach("#card-container");
      cardRef.current = card;
    })();
  }, [sdkReady]);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // 1. Tokenize the card first, before creating any accounts
      const result = await cardRef.current.tokenize();
      if (result.status !== "OK") {
        throw new Error(result.errors?.[0]?.message || "Card declined");
      }
      const cardNonce = result.token;

      // 2. Create the Supabase auth account
      const supabase = createBrowserSupabase();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (signUpError) throw signUpError;
      const userId = data.user?.id;
      if (!userId) throw new Error("Could not create account");

      // 3. Create the client row
      const { error: insertError } = await supabase.from("clients").insert({
        id: userId,
        full_name: fullName,
        email,
        status: "new",
      });
      if (insertError) throw insertError;

      // 4. Create the Square subscription via our API route
      const resp = await fetch("/api/square/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId: userId, fullName, email, cardNonce }),
      });
      const json = await resp.json();
      if (!resp.ok) throw new Error(json.error || "Payment setup failed");

      router.push("/portal");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Script
        src="https://sandbox.web.squarecdn.com/v1/square.js"
        onLoad={() => setSdkReady(true)}
      />
      <main className="flex min-h-screen items-center justify-center px-6 py-12 bg-brand-black">
        <form
          onSubmit={handleSignup}
          className="w-full max-w-sm bg-white p-8 rounded-lg"
        >
          <div className="flex items-center gap-2 mb-6">
            <img src="/logo.png" alt="T Martin Training" className="w-10 h-10 rounded-full" />
            <span className="font-display font-semibold tracking-wide">T MARTIN TRAINING</span>
          </div>
          <h1 className="font-display italic font-semibold uppercase text-2xl mb-6">
            Apply for Coaching
          </h1>
          {error && (
            <p className="text-red-600 text-sm mb-4 bg-red-50 p-2 rounded">
              {error}
            </p>
          )}
          <label className="block text-sm mb-1">Full Name</label>
          <input
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 mb-4"
          />
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
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 mb-4"
          />
          <label className="block text-sm mb-1">Card Details</label>
          <div
            id="card-container"
            className="border rounded-lg p-3 mb-6 min-h-[56px]"
          />
          <button
            type="submit"
            disabled={loading || !sdkReady}
            className="w-full bg-brand text-white py-2.5 font-semibold tracking-wide hover:bg-brand-dark transition disabled:opacity-50"
          >
            {loading ? "SETTING UP..." : "START MEMBERSHIP — $/MONTH"}
          </button>
          <p className="text-xs text-neutral-400 mt-3 text-center">
            Billed monthly via Square. Cancel anytime.
          </p>
        </form>
      </main>
    </>
  );
}
