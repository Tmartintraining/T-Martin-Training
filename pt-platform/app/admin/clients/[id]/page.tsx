"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase";

type Template = { id: string; title: string; content: any };

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState<any>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [mode, setMode] = useState<"template" | "custom">("template");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [customTitle, setCustomTitle] = useState("");
  const [customContent, setCustomContent] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      const supabase = createBrowserSupabase();
      const { data: clientData } = await supabase
        .from("clients")
        .select("*")
        .eq("id", id)
        .single();
      setClient(clientData);

      const { data: templateData } = await supabase
        .from("program_templates")
        .select("*");
      setTemplates(templateData || []);
    })();
  }, [id]);

  async function assignProgram() {
    const supabase = createBrowserSupabase();
    setSaved(false);

    if (mode === "template") {
      const template = templates.find((t) => t.id === selectedTemplate);
      if (!template) return;
      await supabase.from("client_programs").insert({
        client_id: id,
        template_id: template.id,
        title: template.title,
        content: template.content,
      });
    } else {
      await supabase.from("client_programs").insert({
        client_id: id,
        title: customTitle,
        content: [{ note: customContent }],
      });
    }

    await supabase.from("clients").update({ status: "active" }).eq("id", id);
    setSaved(true);
  }

  if (!client) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold mb-1">{client.full_name}</h1>
      <p className="text-neutral-500 mb-6">{client.email}</p>

      <div className="bg-white border rounded-xl p-6 mb-6">
        <h2 className="font-medium mb-4">Assign a Program</h2>
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setMode("template")}
            className={`px-3 py-1.5 rounded-lg text-sm ${
              mode === "template" ? "bg-brand text-white" : "bg-neutral-100"
            }`}
          >
            Use Template
          </button>
          <button
            onClick={() => setMode("custom")}
            className={`px-3 py-1.5 rounded-lg text-sm ${
              mode === "custom" ? "bg-brand text-white" : "bg-neutral-100"
            }`}
          >
            Write Custom
          </button>
        </div>

        {mode === "template" ? (
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">Select a template...</option>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
        ) : (
          <>
            <input
              placeholder="Program title"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mb-3"
            />
            <textarea
              placeholder="Write the program here (exercises, sets, reps, notes)..."
              value={customContent}
              onChange={(e) => setCustomContent(e.target.value)}
              rows={8}
              className="w-full border rounded-lg px-3 py-2"
            />
          </>
        )}

        <button
          onClick={assignProgram}
          className="mt-4 bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-dark"
        >
          Assign to {client.full_name}
        </button>
        {saved && (
          <p className="text-green-600 text-sm mt-2">Program assigned ✓</p>
        )}
      </div>
    </div>
  );
}
