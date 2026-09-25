"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  side?: "left" | "right";
  title?: string;
  children: ReactNode;
  widthClass?: string;
}

export function Drawer({ open, onClose, side = "right", title, children, widthClass = "w-[86vw] max-w-[360px]" }: DrawerProps) {
  const [closing, setClosing] = useState(false);

  const requestClose = useCallback(() => {
    setClosing(true);
    window.setTimeout(() => {
      onClose();
      setClosing(false);
    }, 220);
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, requestClose]);

  if (!open) return null;

  const enter = side === "right" ? "animate-drawer-in" : "animate-drawer-in-left";

  return (
    <div className="fixed inset-0 z-50">
      <div className={cn("absolute inset-0 bg-black/60 backdrop-blur-[2px]", closing ? "animate-fade-out" : "animate-fade-in")} onClick={requestClose} aria-hidden />
      <div
        className={cn(
          "absolute inset-y-0 flex flex-col border-edge bg-surface shadow-2xl",
          side === "right" ? "right-0 border-l" : "left-0 border-r",
          widthClass,
          closing ? "animate-fade-out" : enter
        )}
      >
        {title && (
          <div className="flex items-center justify-between border-b border-edge px-4 py-3.5">
            <h2 className="font-display text-[14px] font-semibold text-ink">{title}</h2>
            <button type="button" onClick={requestClose} className="rounded-lg p-1.5 text-ink-3 hover:bg-surface-2 hover:text-ink" aria-label="Close">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}