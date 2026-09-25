"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "accent" | "muted" | "ok" | "warn" | "danger" | "info";

const TONES: Record<Tone, string> = {
  accent: "bg-accent-soft text-accent border-accent/25",
  muted: "bg-surface-2 text-ink-2 border-edge",
  ok: "bg-ok-soft text-ok border-ok/25",
  warn: "bg-warn-soft text-warn border-warn/25",
  danger: "bg-danger-soft text-danger border-danger/25",
  info: "bg-accent-soft text-cyan border-accent/25",
};

export function Badge({
  tone = "muted",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
        TONES[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function StatusDot({ tone, pulse }: { tone: Tone; pulse?: boolean }) {
  const colors: Record<Tone, string> = {
    accent: "bg-accent",
    muted: "bg-ink-3",
    ok: "bg-ok",
    warn: "bg-warn",
    danger: "bg-danger",
    info: "bg-cyan",
  };
  return (
    <span className="relative inline-flex h-1.5 w-1.5">
      {pulse && (
        <span className={cn("absolute inline-flex h-full w-full rounded-full opacity-60 animate-pulse-soft", colors[tone])} />
      )}
      <span className={cn("relative inline-flex h-1.5 w-1.5 rounded-full", colors[tone])} />
    </span>
  );
}