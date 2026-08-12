"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  async function load() {
    const supabase = createBrowserSupabase();
    const { data } = await supabase
      .from("program_templates")
      .select("*")
      .order("created_at", { ascending: false });
    setTemplates(data || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function saveTemplate() {
    if (!title.trim()) return;
    const supabase = createBrowserSupabase();
    await supabase.from("program_templates").insert({
      title,
      content: [{ note: content }],
    });
    setTitle("");
    setContent("");
    load();
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold mb-6">Program Templates</h1>

      <div className="bg-white border rounded-xl p-6 mb-8">
        <h2 className="font-medium mb-4">Write a New Template</h2>
        <input
          placeholder="Template title (e.g. 'Beginner Strength - 4 Weeks')"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mb-3"
        />
        <textarea
          placeholder="Write the full program..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={8}
          className="w-full border rounded-lg px-3 py-2 mb-4"
        />
        <button
          onClick={saveTemplate}
          className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-dark"
        >
          Save Template
        </button>
      </div>

      <h2 className="font-medium mb-3">Your Templates</h2>
      <div className="space-y-3">
        {templates.map((t) => (
          <div key={t.id} className="bg-white border rounded-xl p-4">
            <p className="font-medium">{t.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
