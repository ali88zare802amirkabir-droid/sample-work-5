"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowUpRight,
  FileText,
  Files,
  FolderKanban,
  Layers,
  Lightbulb,
  MessageSquarePlus,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { timeAgo } from "@/lib/utils";
import type { ActivityItem } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { BarChart } from "@/components/ui/charts";

export type KpiAccent = "blue" | "violet" | "emerald" | "amber";

const ACCENTS: Record<KpiAccent, { hex: string; chip: string }> = {
  blue: { hex: "#6fb4ff", chip: "text-cyan" },
  violet: { hex: "#a78bfa", chip: "text-[#a78bfa]" },
  emerald: { hex: "#34d399", chip: "text-ok" },
  amber: { hex: "#fbbf24", chip: "text-warn" },
};

export function KpiCell({
  label,
  value,
  delta,
  up,
  accent,
  icon,
}: {
  label: string;
  value: string;
  delta: string;
  up: boolean;
  accent: KpiAccent;
  icon: ReactNode;
}) {
  const a = ACCENTS[accent];
  return (
    <div className="card kpi-cell p-5 transition-colors hover:border-edge-strong">
      <div className="flex items-center justify-between">
        <p className="text-[12px] font-medium text-ink-3">{label}</p>
        <span
          className="flex h-8 w-8 items-center justify-center rounded-lg border"
          style={{ background: `${a.hex}1f`, borderColor: `${a.hex}33`, color: a.hex }}
        >
          {icon}
        </span>
      </div>
      <p className="mt-2 font-display text-2xl font-bold tabular text-ink">{value}</p>
      <p className={cn("mt-1 inline-flex items-center gap-1 text-[11.5px] font-semibold", a.chip)}>
        {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
        {delta}
        <span className="ml-0.5 font-normal text-ink-3">this week</span>
      </p>
    </div>
  );
}

const ACTIVITY_ICONS: Record<ActivityItem["kind"], { icon: typeof Lightbulb; color: string }> = {
  generate: { icon: WandSparkles, color: "#6fb4ff" },
  summary: { icon: FileText, color: "#34d399" },
  idea: { icon: Lightbulb, color: "#fbbf24" },
  project: { icon: FolderKanban, color: "#a78bfa" },
  doc: { icon: Files, color: "#38bdf8" },
  template: { icon: Layers, color: "#fb7185" },
};

export function ActivityRow({ item }: { item: ActivityItem }) {
  const meta = ACTIVITY_ICONS[item.kind];
  return (
    <li className="flex items-center gap-3">
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border"
        style={{ background: `${meta.color}1c`, borderColor: `${meta.color}2e`, color: meta.color }}
      >
        <meta.icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[12.5px] font-medium text-ink">{item.text}</p>
      </div>
      <span className="shrink-0 text-[11px] text-ink-3">{timeAgo(item.when)}</span>
    </li>
  );
}

export function MemoryUsageBars({ data }: { data: { label: string; value: number }[] }) {
  return <BarChart data={data} height={180} accent="#38d3f0" secondary="#6fb4ff" />;
}

export function TemplateStrip() {
  return (
    <Link
      href="/templates"
      className="group flex h-full flex-col items-start gap-2 rounded-2xl border border-dashed border-edge-strong p-4 text-left transition-colors hover:bg-surface-2"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-soft text-accent">
        <Sparkles className="h-4 w-4" />
      </span>
      <div>
        <p className="text-[12.5px] font-semibold text-ink">Browse all templates</p>
        <p className="mt-0.5 text-[11.5px] text-ink-3">10 templates across five categories</p>
      </div>
    </Link>
  );
}

export function DemoNote() {
  return (
    <Badge tone="muted">
      <MessageSquarePlus className="h-3 w-3 text-cyan" />
      Interactive demo — data simulated locally
    </Badge>
  );
}