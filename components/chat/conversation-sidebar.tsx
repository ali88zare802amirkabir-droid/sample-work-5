"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageSquarePlus, Search, Trash2 } from "lucide-react";
import { useApp } from "@/lib/store";
import { cn, timeAgo } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function ConversationSidebar({
  activeId,
  onSelect,
  onNew,
}: {
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
}) {
  const { chats, deleteChat, toast } = useApp();
  const [q, setQ] = useState("");

  const list = chats
    .filter((c) => c.title.toLowerCase().includes(q.trim().toLowerCase()))
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));

  return (
    <div className="flex h-full flex-col">
      <div className="space-y-2 p-3">
        <Button className="w-full justify-start" size="md" onClick={onNew}>
          <MessageSquarePlus className="h-4 w-4" />
          New chat
        </Button>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-3" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search conversations"
            className="h-9 w-full rounded-xl border border-edge bg-surface-2/60 pl-9 pr-3 text-[12.5px] text-ink placeholder:text-ink-3 focus:border-accent/40 focus:outline-none"
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-2">
        {list.length === 0 && (
          <p className="px-3 py-6 text-center text-[12px] text-ink-3">
            {q ? "No conversations match that search." : "Start a conversation to see it here."}
          </p>
        )}
        <div className="space-y-0.5">
          {list.map((c) => {
            const active = c.id === activeId;
            return (
              <div
                key={c.id}
                className={cn(
                  "group flex items-center gap-2 rounded-xl px-2.5 py-2 transition-colors",
                  active ? "bg-accent-soft" : "hover:bg-surface-2"
                )}
              >
                <button
                  type="button"
                  onClick={() => onSelect(c.id)}
                  className="min-w-0 flex-1 text-left"
                >
                  <p className={cn("truncate text-[12.5px] font-medium", active ? "text-accent" : "text-ink")}>
                    {c.title}
                  </p>
                  <p className="mt-0.5 text-[10.5px] text-ink-3">
                    {c.messages.length ? `${c.messages.length} messages · ` : "Empty · "}
                    {timeAgo(c.updatedAt)}
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    deleteChat(c.id);
                    if (active) onNew();
                    toast("Conversation deleted", { desc: c.title, variant: "info" });
                  }}
                  className="rounded-md p-1.5 text-ink-3 opacity-0 transition-opacity hover:bg-surface-3 hover:text-danger focus:opacity-100 group-hover:opacity-100"
                  aria-label={`Delete ${c.title}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t border-edge p-3">
        <Link
          href="/templates"
          className="block rounded-xl px-2.5 py-2 text-[12px] font-medium text-ink-3 transition-colors hover:bg-surface-2 hover:text-ink"
        >
          Browse templates →
        </Link>
      </div>
    </div>
  );
}