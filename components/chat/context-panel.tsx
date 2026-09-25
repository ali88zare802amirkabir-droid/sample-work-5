"use client";

import { Eraser, Sparkles } from "lucide-react";
import type { DemoChat } from "@/lib/types";
import { useApp } from "@/lib/store";
import { models } from "@/data/workspaces";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const SUGGESTIONS = [
  "Create a short product description for a wireless keyboard.",
  "Help me brainstorm a marketing angle for a spring product launch.",
  "Explain retrieval-augmented generation simply.",
];

export function ContextPanel({
  chat,
  onSuggest,
  onClear,
}: {
  chat: DemoChat;
  onSuggest: (prompt: string) => void;
  onClear: () => void;
}) {
  const { workspaceId } = useApp();
  const model = models.find((m) => m.id === chat.model) ?? models[0];
  const aiCount = chat.messages.filter((m) => m.role === "ai").length;
  const approxTokens = chat.messages.reduce((n, m) => {
    return (
      n +
      m.blocks.reduce((b, x) => {
        if (x.type === "code") return b + x.code.length;
        if (x.type === "bullets") return b + x.items.join(" ").length;
        return b + x.text.length;
      }, 0)
    );
  }, 0);
  const tokensLabel = Math.max(1, Math.round(approxTokens / 4)).toLocaleString("en-US");

  return (
    <div className="space-y-4 p-4">
      <section className="card p-4">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-ink-3">Conversation</p>
        <h2 className="font-display text-[15px] font-semibold leading-snug text-ink">{chat.title}</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge tone="accent">{model.name}</Badge>
          <Badge tone="muted">{chat.messages.length} messages</Badge>
          {aiCount > 0 && <Badge tone="muted">~{tokensLabel} tokens</Badge>}
        </div>
      </section>

      <section className="card p-4">
        <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-ink-3">Try a prompt</p>
        <div className="space-y-2">
          {SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onSuggest(s)}
              className="flex w-full items-start gap-2 rounded-xl border border-edge p-2.5 text-left text-[12.5px] leading-relaxed text-ink-2 transition-colors hover:border-accent/30 hover:bg-accent-soft/50"
            >
              <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
              {s}
            </button>
          ))}
        </div>
      </section>

      <section className="card p-4">
        <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-ink-3">Workspace</p>
        <div className="flex items-center gap-2.5">
          <Avatar name={workspaceId === "ali" ? "AV" : workspaceId === "nexastudio" ? "NX" : "P"} seed={workspaceId === "ali" ? 0 : 1} />
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold text-ink">
              {workspaceId === "ali" ? "Ali's Workspace" : workspaceId === "nexastudio" ? "Nexa Studio" : "Personal"}
            </p>
            <p className="text-[11px] text-ink-3">Data stay in this demo browser</p>
          </div>
        </div>
      </section>

      <Button variant="ghost" className={cn("w-full justify-start text-danger hover:bg-danger-soft hover:text-danger")} onClick={onClear}>
        <Eraser className="h-4 w-4" />
        Clear conversation
      </Button>

      <p className="px-1 text-[10.5px] leading-relaxed text-ink-3">
        Responses are generated locally by a tiny demo engine — no external AI service is called.
      </p>
    </div>
  );
}