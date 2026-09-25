"use client";

import Link from "next/link";
import {
  Bot,
  FileText,
  FolderKanban,
  MessageSquare,
  Sparkles,
  Zap,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { greeting } from "@/lib/utils";
import { recentActivity, usageLast7 } from "@/data/usage";
import { templates } from "@/data/templates";
import { projects } from "@/data/projects";
import { documents } from "@/data/documents";
import {
  ActivityRow,
  DemoNote,
  KpiCell,
  MemoryUsageBars,
  TemplateStrip,
} from "@/components/dashboard/widgets";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const FAVORITES = templates.filter((t) =>
  ["tpl-product", "tpl-email", "tpl-code", "tpl-summary"].includes(t.id)
);

export default function OverviewPage() {
  const { workspaceId } = useApp();
  const name = workspaceId === "personal" ? "there" : "Ali";
  const weekRequests = usageLast7.reduce((s, d) => s + d.requests, 0);
  const weekTokens = usageLast7.reduce((s, d) => s + d.tokens, 0);
  const weekTokensK = `${Math.round(weekTokens / 1000)}K`;

  return (
    <div className="mx-auto max-w-[1240px] space-y-6 px-4 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <DemoNote />
            <Badge tone="muted">Nexa Pro</Badge>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-[26px]">
            {greeting()}, {name}
          </h1>
          <p className="mt-1 text-sm text-ink-3">Here&apos;s what&apos;s happening in your AI workspace.</p>
        </div>
        <Link href="/chat?new=1">
          <Button>
            <MessageSquare className="h-4 w-4" />
            New chat
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        <KpiCell label="AI Requests" value={weekRequests.toLocaleString("en-US")} delta="12.4%" up accent="blue" icon={<Zap className="h-4 w-4" />} />
        <KpiCell label="Tokens Used" value={weekTokensK} delta="8.1%" up accent="violet" icon={<Bot className="h-4 w-4" />} />
        <KpiCell label="Active Projects" value={String(projects.length)} delta="2 new" up accent="emerald" icon={<FolderKanban className="h-4 w-4" />} />
        <KpiCell label="Saved Documents" value={String(documents.length)} delta="5" up accent="amber" icon={<FileText className="h-4 w-4" />} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-[15px] font-semibold text-ink">Usage Overview</h2>
              <p className="text-[12px] text-ink-3">{weekRequests.toLocaleString("en-US")} requests over the last 7 days</p>
            </div>
            <Link href="/usage" className="text-[12.5px] font-medium text-accent hover:text-cyan">
              Full usage
            </Link>
          </div>
          <MemoryUsageBars data={usageLast7.map((d) => ({ label: d.label, value: d.requests }))} />
        </div>

        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[15px] font-semibold text-ink">Recent Activity</h2>
            <Badge tone="muted">{recentActivity.length} events</Badge>
          </div>
          <ul className="space-y-3.5">
            {recentActivity.map((item) => (
              <ActivityRow key={item.id} item={item} />
            ))}
          </ul>
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[15px] font-semibold text-ink">Favorite Templates</h2>
          <Link href="/templates" className="text-[12.5px] font-medium text-accent hover:text-cyan">
            View all
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {FAVORITES.map((t) => (
            <Link
              key={t.id}
              href={`/chat?tpl=${t.id}`}
              className="card group p-4 transition-all hover:-translate-y-0.5 hover:border-edge-strong"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-soft text-accent transition-colors group-hover:bg-accent/20">
                <Sparkles className="h-4 w-4" />
              </span>
              <p className="mt-3 text-[13px] font-semibold text-ink">{t.title}</p>
              <p className="mt-1 line-clamp-2 text-[11.5px] leading-relaxed text-ink-3">{t.desc}</p>
              <p className="mt-2.5 flex items-center gap-1 text-[10.5px] font-semibold uppercase tracking-wider text-ink-3">
                <Zap className="h-3 w-3 text-warn" />
                {t.uses.toLocaleString("en-US")} runs
              </p>
            </Link>
          ))}
          <TemplateStrip />
        </div>
      </div>
    </div>
  );
}