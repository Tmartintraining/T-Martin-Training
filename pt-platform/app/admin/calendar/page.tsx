"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase";
import { format, isSameDay, addDays, startOfWeek } from "date-fns";

export default function CalendarPage() {
  const [checkIns, setCheckIns] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );

  async function load() {
    const supabase = createBrowserSupabase();
    const { data: ci } = await supabase
      .from("check_ins")
      .select("*, clients(full_name)")
      .order("scheduled_at");
    setCheckIns(ci || []);
    const { data: cl } = await supabase.from("clients").select("id, full_name");
    setClients(cl || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function scheduleCheckIn() {
    if (!selectedClient) return;
    const supabase = createBrowserSupabase();
    await supabase.from("check_ins").insert({
      client_id: selectedClient,
      scheduled_at: new Date(selectedDate).toISOString(),
    });
    load();
  }

  const weekStart = startOfWeek(new Date());
  const weekDays = Array.from({ length: 7 }).map((_, i) =>
    addDays(weekStart, i)
  );

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Check-in Calendar</h1>

      <div className="bg-white border rounded-xl p-6 mb-8 max-w-lg">
        <h2 className="font-medium mb-4">Schedule a Check-in</h2>
        <select
          value={selectedClient}
          onChange={(e) => setSelectedClient(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mb-3"
        >
          <option value="">Select client...</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.full_name}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mb-4"
        />
        <button
          onClick={scheduleCheckIn}
          className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-dark"
        >
          Schedule
        </button>
      </div>

      <div className="grid grid-cols-7 gap-3">
        {weekDays.map((day) => {
          const dayCheckIns = checkIns.filter((c) =>
            isSameDay(new Date(c.scheduled_at), day)
          );
          return (
            <div key={day.toISOString()} className="bg-white border rounded-xl p-3 min-h-[140px]">
              <p className="text-xs font-medium text-neutral-500 mb-2">
                {format(day, "EEE d")}
              </p>
              {dayCheckIns.map((ci) => (
                <div
                  key={ci.id}
                  className={`text-xs p-2 rounded mb-1 ${
                    ci.completed
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {ci.clients?.full_name}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
