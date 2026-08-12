"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createBrowserSupabase } from "@/lib/supabase";

type Client = {
  id: string;
  full_name: string;
  email: string;
  status: string;
  subscription_status: string;
  created_at: string;
};

const statusColor: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  active: "bg-green-100 text-green-700",
  paused: "bg-yellow-100 text-yellow-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const supabase = createBrowserSupabase();
      const { data } = await supabase
        .from("clients")
        .select("*")
        .order("created_at", { ascending: false });
      setClients(data || []);
      setLoading(false);
    })();
  }, []);

  const newClients = clients.filter((c) => c.status === "new");

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2">Your Clients</h1>
      <p className="text-neutral-500 mb-6">
        {clients.length} total · {newClients.length} need a program
      </p>

      {newClients.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="font-medium text-blue-800 mb-1">
            Action needed: {newClients.length} new client
            {newClients.length > 1 ? "s" : ""} without a program yet
          </p>
          <p className="text-sm text-blue-700">
            {newClients.map((c) => c.full_name).join(", ")}
          </p>
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-neutral-100 text-sm text-neutral-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Billing</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="px-4 py-3 font-medium">{c.full_name}</td>
                  <td className="px-4 py-3 text-neutral-500">{c.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${statusColor[c.status]}`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-500">
                    {c.subscription_status}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/clients/${c.id}`}
                      className="text-brand font-medium hover:underline text-sm"
                    >
                      View / Assign Program
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
