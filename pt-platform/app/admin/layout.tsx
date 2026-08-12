"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createBrowserSupabase } from "@/lib/supabase";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [checked, setChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const supabase = createBrowserSupabase();
      const { data } = await supabase.auth.getUser();
      const email = data.user?.email?.toLowerCase();
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.toLowerCase();
      if (!email || email !== adminEmail) {
        router.push("/login");
        return;
      }
      setChecked(true);
    })();
  }, [router]);

  if (!checked) return null;

  return (
    <div className="flex min-h-screen">
      <nav className="w-60 bg-brand-black text-white p-6 flex flex-col gap-1">
        <div className="flex items-center gap-2 mb-8">
          <img src="/logo.png" alt="T Martin Training" className="w-9 h-9 rounded-full" />
          <span className="font-display font-semibold text-sm tracking-wide">
            T MARTIN TRAINING
          </span>
        </div>
        <p className="text-xs uppercase tracking-widest text-neutral-500 mb-2">Dashboard</p>
        <Link href="/admin" className="py-2 px-2 rounded hover:bg-brand transition">
          Clients
        </Link>
        <Link href="/admin/templates" className="py-2 px-2 rounded hover:bg-brand transition">
          Program Templates
        </Link>
        <Link href="/admin/calendar" className="py-2 px-2 rounded hover:bg-brand transition">
          Check-in Calendar
        </Link>
      </nav>
      <div className="flex-1 p-8 bg-brand-cream">{children}</div>
    </div>
  );
}
