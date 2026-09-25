"use client";

import { CheckCircle2, Info, TriangleAlert, X } from "lucide-react";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

const ICONS = {
  success: CheckCircle2,
  info: Info,
  danger: TriangleAlert,
};

const ACCENTS = {
  success: "text-ok",
  info: "text-cyan",
  danger: "text-danger",
};

export function ToastHost() {
  const { toasts, dismissToast } = useApp();
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-2">
      {toasts.map((t) => {
        const Icon = ICONS[t.variant];
        return (
          <div key={t.id} role="status" className="pointer-events-auto animate-toast-in card flex items-start gap-3 border-edge-strong bg-surface/95 p-3.5 shadow-2xl">
            <Icon className={cn("mt-0.5 h-4.5 w-4.5 shrink-0", ACCENTS[t.variant])} />
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-ink">{t.title}</p>
              {t.desc && <p className="mt-0.5 text-[12px] leading-relaxed text-ink-3">{t.desc}</p>}
            </div>
            <button type="button" onClick={() => dismissToast(t.id)} className="rounded-md p-1 text-ink-3 hover:text-ink" aria-label="Dismiss">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}