"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CornerDownLeft,
  FileText,
  FolderKanban,
  MessageSquare,
  Plus,
  Search,
  Sparkles,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import { projects } from "@/data/projects";
import { documents } from "@/data/documents";
import { templates } from "@/data/templates";

interface Result {
  id: string;
  kind: "Conversation" | "Project" | "Document" | "Template" | "Action";
  label: string;
  sub: string;
  action: () => void;
}

export function SearchOverlay() {
  const { searchOpen, setSearchOpen, chats } = useApp();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const go = useCallback(
    (path: string) => {
      router.push(path);
      setSearchOpen(false);
    },
    [router, setSearchOpen]
  );

  const results = useMemo<Result[]>(() => {
    const q = query.trim().toLowerCase();
    const list: Result[] = [
      ...chats.map((c) => ({
        id: `conv-${c.id}`,
        kind: "Conversation" as const,
        label: c.title,
        sub: c.messages.length ? `${c.messages.length} messages` : "Empty conversation",
        action: () => go(`/chat?c=${c.id}`),
      })),
      ...projects.map((p) => ({
        id: `proj-${p.id}`,
        kind: "Project" as const,
        label: p.name,
        sub: `${p.status} · ${p.progress}%`,
        action: () => go(`/projects/${p.id}`),
      })),
      ...documents.map((d) => ({
        id: `doc-${d.id}`,
        kind: "Document" as const,
        label: d.name,
        sub: `${d.type} · ${d.size}`,
        action: () => go(`/documents?doc=${d.id}`),
      })),
      ...templates.map((t) => ({
        id: `tpl-${t.id}`,
        kind: "Template" as const,
        label: t.title,
        sub: t.category,
        action: () => go(`/chat?tpl=${t.id}`),
      })),
      { id: "act-new", kind: "Action" as const, label: "Start a new chat", sub: "AI Chat", action: () => go("/chat?new=1") },
      { id: "act-chat", kind: "Action" as const, label: "Open AI Chat", sub: "AI Chat", action: () => go("/chat") },
    ];
    if (!q) return list.slice(0, 12);
    return list
      .filter((r) => `${r.label} ${r.sub}`.toLowerCase().includes(q))
      .slice(0, 12);
  }, [query, chats, go]);

  useEffect(() => {
    const t = window.setTimeout(() => setActive(0), 0);
    return () => window.clearTimeout(t);
  }, [query, searchOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
      }
    };
    const t = window.setTimeout(() => inputRef.current?.focus(), 40);
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      setQuery("");
    };
  }, [searchOpen, setSearchOpen]);

  const run = (r: Result) => {
    if (r) r.action();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      run(results[active]);
    }
  };

  if (!searchOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center p-4 pt-[10vh] sm:p-6 sm:pt-[14vh]">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] animate-fade-in" onClick={() => setSearchOpen(false)} aria-hidden />
      <div className="relative z-10 w-full max-w-xl animate-scale-in overflow-hidden rounded-2xl border border-edge-strong bg-surface shadow-2xl">
        <div className="flex items-center gap-3 border-b border-edge px-4">
          <Search className="h-4 w-4 shrink-0 text-ink-3" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search conversations, projects, documents, templates…"
            className="h-13 w-full bg-transparent text-[14px] text-ink outline-none placeholder:text-ink-3"
          />
          <kbd className="kbd hidden sm:inline-block">esc</kbd>
        </div>
        <div className="max-h-[46vh] overflow-y-auto p-2">
          {results.length === 0 && (
            <p className="px-3 py-8 text-center text-[13px] text-ink-3">
              No matches for “{query}”. Try “keyboard”, “campaign” or “summary”.
            </p>
          )}
          {results.map((r, i) => {
            const Icon =
              r.kind === "Conversation"
                ? MessageSquare
                : r.kind === "Project"
                  ? FolderKanban
                  : r.kind === "Document"
                    ? FileText
                    : r.kind === "Template"
                      ? Sparkles
                      : Plus;
            return (
              <button
                key={r.id}
                type="button"
                onMouseEnter={() => setActive(i)}
                onClick={() => run(r)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                  active === i ? "bg-accent-soft" : "hover:bg-surface-2"
                )}
              >
                <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border", active === i ? "border-accent/30 text-accent" : "border-edge text-ink-3")}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-ink">{r.label}</p>
                  <p className="truncate text-[11px] text-ink-3">{r.sub}</p>
                </div>
                <span className="hidden shrink-0 items-center gap-1 text-[10.5px] font-medium uppercase tracking-wider text-ink-3 sm:flex">
                  {r.kind}
                </span>
                {active === i && <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-accent" />}
              </button>
            );
          })}
        </div>
        <div className="border-t border-edge px-4 py-2.5 text-[10.5px] text-ink-3">
          <span className="font-semibold text-ink-2">↑↓</span> to navigate · <span className="font-semibold text-ink-2">Enter</span> to open · everything is local demo data
        </div>
      </div>
    </div>
  );
}