"use client";

import { cn, initials } from "@/lib/utils";

const GRADIENTS: [string, string][] = [
  ["#6fb4ff", "#38d3f0"],
  ["#a78bfa", "#6fb4ff"],
  ["#34d399", "#38d3f0"],
  ["#fbbf24", "#fb7185"],
  ["#38bdf8", "#a78bfa"],
];

export function Avatar({
  name,
  size = "md",
  seed = 0,
  className,
}: {
  name: string;
  size?: "sm" | "md" | "lg";
  seed?: number;
  className?: string;
}) {
  const [from, to] = GRADIENTS[Math.abs(seed) % GRADIENTS.length];
  const box = size === "sm" ? "h-7 w-7 text-[9px]" : size === "lg" ? "h-11 w-11 text-[13px]" : "h-8 w-8 text-[10.5px]";
  return (
    <span
      className={cn("flex shrink-0 items-center justify-center rounded-full font-bold text-white/95 ring-1 ring-white/20", box, className)}
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      {initials(name)}
    </span>
  );
}