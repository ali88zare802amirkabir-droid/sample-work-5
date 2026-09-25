"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, MessageSquare, PencilLine, Play, Sparkles } from "lucide-react";
import type { ProjectActivity, ProjectChatRef, ProjectDoc } from "@/lib/types";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type Tab = "overview" | "chats" | "documents" | "activity";

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "chats", label: "Chats" },
  { id: "documents", label: "Documents" },
  { id: "activity", label: "Activity" },
];

const ACT_ICON = {
  chat: <MessageSquare className="h-3.5 w-3.5" />,
  doc: <FileText className="h-3.5 w-3.5" />,
  model: <Sparkles className="h-3.5 w-3.5" />,
  edit: <PencilLine className="h-3.5 w-3.5" />,
};

const ACT_COLOR: Record<ProjectActivity["kind"], string> = {
  chat: "text-accent",
  doc: "text-sky",
  model: "text-warn",
  edit: "text-ink-3",
};

export default function ProjectTabs({
  projectId,
  chats,
  docs,
  activity,
}: {
  projectId: string;
  chats: ProjectChatRef[];
  docs: ProjectDoc[];
  activity: ProjectActivity[];
}) {
  const [tab, setTab] = useState<Tab>("overview");
  const { toast } = useApp();

  return (
    <div>
      <div className="flex gap-1 overflow-x-auto border-b border-edge">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "whitespace-nowrap border-b-2 px-4 py-2.5 text-[13px] font-semibold transition-colors",
              tab === t.id ? "border-accent text-ink" : "border-transparent text-ink-3 hover:text-ink"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="py-5">
        {tab === "overview" && (
          <div className="space-y-4">
            <div className="card p-5">
              <h3 className="text-[15px] font-semibold text-ink">Summary</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-ink-2">
                {projectId === "marketing-campaign" &&
                  "This project is preparing a spring launch across three channels. The main threads cover the campaign narrative, a keyboard product description and outreach copy. Documents include the campaign brief and channel notes — most work is happening in the Chats tab this week."}
                {projectId === "vortex-website" &&
                  "A site refresh for the studio. The core questions are voice and structure: how the homepage hero reads, and how copy is organized per section. Copy drafts and a technical spec live under Documents."}
                {projectId === "product-research" &&
                  "Research phase in progress. Customer interviews are summarized, and the competitor matrix is being updated. Findings cluster into three themes worth reviewing in the Chats tab."}
                {projectId === "content-studio" &&
                  "Editorial work: the calendar is up to date and a newsletter outline was drafted. Next up is a blog outline built from the outline document."}
                {projectId === "code-assistant" &&
                  "An internal assistant for docs and code Q&A. The debounced search hook lives in the latest chat — reuse it for the settings page."}
                {projectId === "client-onboarding" &&
                  "This project is complete. The checklist document captures the full flow, and the final activity updated the status."}
                {!["marketing-campaign", "vortex-website", "product-research", "content-studio", "code-assistant", "client-onboarding"].includes(projectId) &&
                  "A workspace for this project's chats and documents. Use the tabs above to browse what lives here."}
              </p>
            </div>
            <div className="card p-5">
              <h3 className="text-[15px] font-semibold text-ink">Quick stats</h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-edge bg-surface-2/50 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-3">Conversations</p>
                  <p className="mt-1 font-display text-xl font-bold text-ink">{chats.length}</p>
                </div>
                <div className="rounded-xl border border-edge bg-surface-2/50 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-3">Documents</p>
                  <p className="mt-1 font-display text-xl font-bold text-ink">{docs.length}</p>
                </div>
                <div className="rounded-xl border border-edge bg-surface-2/50 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-3">Recent events</p>
                  <p className="mt-1 font-display text-xl font-bold text-ink">{activity.length}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "chats" && (
          <div className="space-y-2">
            {chats.length === 0 && (
              <div className="card py-12 text-center text-[13px] text-ink-3">
                No chats in this project yet — head to the Chat page to start one.
              </div>
            )}
            {chats.map((c) => (
              <Link
                key={c.id}
                href={`/chat?c=${c.id}`}
                className="card flex items-center gap-3.5 p-4 transition-all hover:-translate-y-0.5 hover:border-edge-strong"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
                  <MessageSquare className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-[13.5px] font-semibold text-ink">{c.title}</p>
                    <Badge tone="muted">{c.when}</Badge>
                  </div>
                  <p className="mt-0.5 truncate text-[12px] text-ink-3">{c.snippet}</p>
                </div>
                <Play className="h-4 w-4 shrink-0 text-ink-3" />
              </Link>
            ))}
          </div>
        )}

        {tab === "documents" && (
          <div className="space-y-2">
            {docs.length === 0 && (
              <div className="card py-12 text-center text-[13px] text-ink-3">
                No documents attached to this project.
              </div>
            )}
            {docs.map((d) => (
              <Link
                key={d.id}
                href={`/documents?doc=${d.id}`}
                className="card flex items-center gap-3.5 p-4 transition-all hover:-translate-y-0.5 hover:border-edge-strong"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-soft text-cyan">
                  <FileText className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-semibold text-ink">{d.name}</p>
                  <p className="mt-0.5 text-[12px] text-ink-3">{d.type} · {d.size}</p>
                </div>
                <span className="shrink-0 text-[11.5px] text-ink-3">{d.updated}</span>
              </Link>
            ))}
          </div>
        )}

        {tab === "activity" && (
          <div className="card divide-y divide-edge">
            {activity.length === 0 && (
              <div className="py-12 text-center text-[13px] text-ink-3">No activity recorded yet.</div>
            )}
            {activity.map((a) => (
              <div key={a.id} className="flex items-center gap-3.5 px-4 py-3">
                <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-2", ACT_COLOR[a.kind])}>
                  {ACT_ICON[a.kind]}
                </span>
                <p className="flex-1 text-[13px] text-ink">{a.text}</p>
                <span className="shrink-0 text-[11.5px] text-ink-3">{a.when}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-[11px] text-ink-3">
        <button
          type="button"
          className="text-accent hover:underline"
          onClick={() => toast("Demo project", { desc: "Tabs switch locally — nothing is written to a server.", variant: "info" })}
        >
          Note
        </button>{" "}
        — this is a showcase page; the project data is fixed demo content.
      </p>
    </div>
  );
}