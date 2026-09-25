"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  titleNode?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  children: ReactNode;
  footer?: ReactNode;
}

const SIZES = {
  sm: "sm:max-w-md",
  md: "sm:max-w-lg",
  lg: "sm:max-w-2xl",
  xl: "sm:max-w-4xl",
};

export function Modal({ open, onClose, title, titleNode, size = "md", children, footer }: ModalProps) {
  const [closing, setClosing] = useState(false);

  const requestClose = useCallback(() => {
    setClosing(true);
    window.setTimeout(() => {
      onClose();
      setClosing(false);
    }, 150);
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

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <div
        className={cn("absolute inset-0 bg-black/60 backdrop-blur-[2px]", closing ? "animate-fade-out" : "animate-fade-in")}
        onClick={requestClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative z-10 flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl border border-edge bg-surface shadow-2xl sm:rounded-2xl",
          SIZES[size],
          closing ? "animate-scale-out" : "animate-scale-in"
        )}
      >
        {(title || titleNode) && (
          <div className="flex items-center justify-between gap-3 border-b border-edge px-5 py-4">
            <div className="min-w-0">
              {titleNode ?? <h2 className="font-display text-[15px] font-semibold text-ink">{title}</h2>}
            </div>
            <button
              type="button"
              onClick={requestClose}
              className="rounded-lg p-1.5 text-ink-3 transition-colors hover:bg-surface-2 hover:text-ink"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
        {footer && <div className="border-t border-edge px-5 py-3.5">{footer}</div>}
      </div>
    </div>
  );
}