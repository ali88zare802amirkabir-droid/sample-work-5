"use client";

import Link from "next/link";
import { FolderKanban, Plus, Search } from "lucide-react";
import { useState } from "react";
import { projects } from "@/data/projects";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DemoNote } from "@/components/dashboard/widgets";

const STATUS_TONE = { Active: "accent", Paused: "warn", Completed: "ok" } as const;

export default function ProjectsPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"All" | "Active" | "Paused" | "Completed">("All");

  const list = projects.filter(
    (p) =>
      (status === "All" || p.status === status) &&
      (p.name + p.desc).toLowerCase().includes(q.trim().toLowerCase())
  );

  return (
    <div className="mx-auto max-w-[1240px] space-y-6 px-4 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-2"><DemoNote /></div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink">Projects</h1>
          <p className="mt-1 text-sm text-ink-3">Everything organized around a goal. Each project keeps its chats and documents in one place.</p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          New project
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search projects"
            className="h-10 w-full rounded-xl border border-edge bg-surface-2/60 pl-9 pr-3 text-[13px] text-ink placeholder:text-ink-3 focus:border-accent/40 focus:outline-none"
          />
        </div>
        <div className="flex gap-1 rounded-full border border-edge bg-surface-2/60 p-1">
          {(["All", "Active", "Paused", "Completed"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-[11.5px] font-semibold transition-colors",
                status === s ? "bg-accent text-white" : "text-ink-3 hover:text-ink"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {list.length === 0 ? (
        <div className="card flex flex-col items-center justify-center gap-2 py-16 text-center">
          <FolderKanban className="h-8 w-8 text-ink-3" />
          <p className="text-sm font-medium text-ink">No projects match</p>
          <p className="text-xs text-ink-3">Try a different search or status filter.</p>
        </div>
      ) : (
        <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((p) => (
            <Link
              key={p.id}
              href={`/projects/${p.id}`}
              className="card group flex flex-col p-5 transition-all hover:-translate-y-0.5 hover:border-edge-strong"
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-md"
                  style={{ background: `linear-gradient(135deg, ${p.from}, ${p.to})` }}
                >
                  <FolderKanban className="h-[18px] w-[18px]" />
                </span>
                <Badge tone={STATUS_TONE[p.status]}>{p.status}</Badge>
              </div>
              <h2 className="mt-3 font-display text-[15px] font-semibold text-ink group-hover:text-accent">{p.name}</h2>
              <p className="mt-1 line-clamp-2 flex-1 text-[12.5px] leading-relaxed text-ink-3">{p.desc}</p>
              <div className="mt-4">
                <div className="mb-1.5 flex items-center justify-between text-[11px]">
                  <span className="font-medium text-ink-3">Progress</span>
                  <span className="font-semibold text-ink">{p.progress}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-surface-3">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${p.progress}%`, background: `linear-gradient(90deg, ${p.from}, ${p.to})` }}
                  />
                </div>
              </div>
              <div className="mt-3.5 flex items-center gap-3 text-[11px] text-ink-3">
                <span>{p.conversations} chats</span>
                <span className="h-1 w-1 rounded-full bg-ink-3/50" />
                <span>{p.documents} docs</span>
                <span className="ml-auto">Updated {p.updated === "0d ago" ? "today" : p.updated}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}