"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase";
import { format } from "date-fns";

export default function PortalPage() {
  const [client, setClient] = useState<any>(null);
  const [program, setProgram] = useState<any>(null);
  const [checkIns, setCheckIns] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const supabase = createBrowserSupabase();
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        router.push("/login");
        return;
      }

      const { data: clientData } = await supabase
        .from("clients")
        .select("*")
        .eq("id", userData.user.id)
        .single();
      setClient(clientData);

      const { data: programData } = await supabase
        .from("client_programs")
        .select("*")
        .eq("client_id", userData.user.id)
        .eq("is_active", true)
        .order("assigned_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      setProgram(programData);

      const { data: checkInData } = await supabase
        .from("check_ins")
        .select("*")
        .eq("client_id", userData.user.id)
        .order("scheduled_at");
      setCheckIns(checkInData || []);
    })();
  }, [router]);

  async function logCheckIn(id: string, weight: string, notes: string) {
    const supabase = createBrowserSupabase();
    await supabase
      .from("check_ins")
      .update({ completed: true, weight: weight || null, notes })
      .eq("id", id);
    setCheckIns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, completed: true, weight, notes } : c))
    );
  }

  if (!client) return <p className="p-8">Loading...</p>;

  const upcoming = checkIns.filter((c) => !c.completed);

  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-semibold mb-1">Welcome back, {client.full_name.split(" ")[0]}</h1>
      <p className="text-neutral-500 mb-8">
        Membership: <span className="capitalize">{client.subscription_status}</span>
      </p>

      <section className="bg-white border rounded-xl p-6 mb-8">
        <h2 className="font-medium mb-3">Your Program</h2>
        {program ? (
          <>
            <p className="font-semibold mb-2">{program.title}</p>
            <p className="text-neutral-600 whitespace-pre-line text-sm">
              {program.content?.[0]?.note || "See details with your coach."}
            </p>
          </>
        ) : (
          <p className="text-neutral-500 text-sm">
            Your coach hasn't assigned a program yet — check back soon.
          </p>
        )}
      </section>

      <section className="bg-white border rounded-xl p-6">
        <h2 className="font-medium mb-3">Check-ins</h2>
        {upcoming.length === 0 ? (
          <p className="text-neutral-500 text-sm">No check-ins scheduled.</p>
        ) : (
          <div className="space-y-4">
            {upcoming.map((ci) => (
              <CheckInForm key={ci.id} checkIn={ci} onSubmit={logCheckIn} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function CheckInForm({
  checkIn,
  onSubmit,
}: {
  checkIn: any;
  onSubmit: (id: string, weight: string, notes: string) => void;
}) {
  const [weight, setWeight] = useState("");
  const [notes, setNotes] = useState("");

  return (
    <div className="border rounded-lg p-4">
      <p className="text-sm font-medium mb-2">
        {format(new Date(checkIn.scheduled_at), "EEEE, MMM d")}
      </p>
      <input
        placeholder="Weight (optional)"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        className="w-full border rounded-lg px-3 py-2 mb-2 text-sm"
      />
      <textarea
        placeholder="How's it going? Any notes for your coach..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={2}
        className="w-full border rounded-lg px-3 py-2 mb-2 text-sm"
      />
      <button
        onClick={() => onSubmit(checkIn.id, weight, notes)}
        className="bg-brand text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-brand-dark"
      >
        Submit Check-in
      </button>
    </div>
  );
}
