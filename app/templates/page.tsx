"use client";

import Link from "next/link";
import { FileText, MessageSquare, Search, Sparkles, WandSparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { templates, templateCategories } from "@/data/templates";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { DemoNote } from "@/components/dashboard/widgets";

const CAT_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  Writing: FileText,
  Marketing: MessageSquare,
  Development: WandSparkles,
  Business: MessageSquare,
  Education: Sparkles,
};

export default function TemplatesPage() {
  const [category, setCategory] = useState<string>("All");
  const [q, setQ] = useState("");

  const list = useMemo(
    () =>
      templates.filter(
        (t) =>
          (category === "All" || t.category === category) &&
          (t.title + t.desc).toLowerCase().includes(q.trim().toLowerCase())
      ),
    [category, q]
  );

  const cats = ["All", ...templateCategories];

  return (
    <div className="mx-auto max-w-[1100px] space-y-6 px-4 sm:px-6">
      <div>
        <div className="mb-2"><DemoNote /></div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-ink">Templates</h1>
        <p className="mt-1 text-sm text-ink-3">
          Pick a proven starting point — it opens a new chat pre-filled with the prompt, ready to run.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search templates"
            className="h-10 w-full rounded-xl border border-edge bg-surface-2/60 pl-9 pr-3 text-[13px] text-ink placeholder:text-ink-3 focus:border-accent/40 focus:outline-none"
          />
        </div>
        <div className="flex gap-1 overflow-x-auto rounded-full border border-edge bg-surface-2/60 p-1">
          {cats.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={cn(
                "whitespace-nowrap rounded-full px-3.5 py-1.5 text-[11.5px] font-semibold transition-colors",
                category === c ? "bg-accent text-white" : "text-ink-3 hover:text-ink"
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((t) => {
          const Icon = CAT_ICON[t.category] ?? Sparkles;
          return (
            <Link
              key={t.id}
              href={`/chat?tpl=${t.id}`}
              className="card group flex flex-col p-4 transition-all hover:-translate-y-0.5 hover:border-edge-strong"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-soft text-accent transition-colors group-hover:bg-accent/20">
                  <Icon className="h-4 w-4" />
                </span>
                <Badge tone="muted">{t.category}</Badge>
              </div>
              <h2 className="mt-3 text-[13.5px] font-semibold text-ink group-hover:text-accent">{t.title}</h2>
              <p className="mt-1 line-clamp-2 flex-1 text-[12px] leading-relaxed text-ink-3">{t.desc}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[10.5px] font-semibold uppercase tracking-wider text-ink-3">
                  {t.uses.toLocaleString("en-US")} runs
                </span>
                <span className="text-[11.5px] font-medium text-accent opacity-0 transition-opacity group-hover:opacity-100">
                  Use template →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}