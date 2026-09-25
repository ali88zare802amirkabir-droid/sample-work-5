"use client";

import { formatNum } from "@/lib/utils";

export function BarChart({
  data,
  height = 168,
  accent = "#6fb4ff",
  secondary,
}: {
  data: { label: string; value: number }[];
  height?: number;
  accent?: string;
  secondary?: string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div>
      <div className="flex items-end gap-2 sm:gap-2.5" style={{ height }}>
        {data.map((d, i) => (
          <div key={i} className="group flex h-full flex-1 flex-col items-center justify-end gap-1.5">
            <span className="text-[10px] font-semibold tabular text-ink-3 opacity-0 transition-opacity group-hover:opacity-100">
              {formatNum(d.value)}
            </span>
            <div
              className="w-full max-w-9 rounded-md transition-[height] duration-300"
              style={{
                height: `${Math.max(3, (d.value / max) * 100)}%`,
                background: `linear-gradient(180deg, ${accent}, ${secondary ?? "rgba(56,211,240,0.35)"})`,
              }}
              title={`${d.label}: ${formatNum(d.value)}`}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-2 sm:gap-2.5">
        {data.map((d, i) => (
          <span key={i} className="flex-1 text-center text-[10px] font-semibold uppercase tracking-wider text-ink-3">
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export function AreaChart({
  data,
  height = 190,
  accent = "#6fb4ff",
}: {
  data: { label: string; value: number }[];
  height?: number;
  accent?: string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const w = 560;
  const h = 140;
  const pts = data.map((d, i) => ({
    x: (i / Math.max(data.length - 1, 1)) * w,
    y: h - (d.value / max) * (h - 14) - 6,
  }));
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const area = `${line} L${w},${h} L0,${h} Z`;

  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} style={{ height }} preserveAspectRatio="none" className="w-full" role="img" aria-label="Usage area chart">
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="0.32" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1="0" x2={w} y1={h * f} y2={h * f} stroke="currentColor" strokeOpacity="0.06" strokeDasharray="3 5" />
        ))}
        <path d={area} fill="url(#areaFill)" />
        <path d={line} fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill={accent} className="opacity-0 transition-opacity hover:opacity-100" />
        ))}
      </svg>
      <div className="mt-1 flex">
        {data.map((d, i) => (
          <span key={i} className="flex-1 text-center text-[10px] font-semibold uppercase tracking-wider text-ink-3">
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export function RingChart({ percent, size = 84, accent = "#6fb4ff" }: { percent: number; size?: number; accent?: string }) {
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  const filled = (Math.min(percent, 100) / 100) * c;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeOpacity="0.1" strokeWidth="7" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={accent}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={`${filled.toFixed(1)} ${c.toFixed(1)}`}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[13px] font-bold tabular text-ink">
        {Math.round(percent)}%
      </span>
    </div>
  );
}