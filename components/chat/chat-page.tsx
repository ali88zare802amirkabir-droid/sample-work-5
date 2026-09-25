"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, Menu, MessageSquare, Send, SlidersHorizontal, Sparkles } from "lucide-react";
import type { ChatMsg, DemoChat, ModelId } from "@/lib/types";
import { useApp } from "@/lib/store";
import { mockReply, titleFromUserPrompt } from "@/lib/mock-ai";
import { cn } from "@/lib/utils";
import { templates } from "@/data/templates";
import { ConversationSidebar } from "@/components/chat/conversation-sidebar";
import { MessageView, TypingIndicator } from "@/components/chat/message-view";
import { ContextPanel } from "@/components/chat/context-panel";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";

const MODELS: { id: ModelId; label: string; hint: string }[] = [
  { id: "fast", label: "Fast", hint: "Quick drafts" },
  { id: "pro", label: "Pro", hint: "Balanced" },
  { id: "creative", label: "Creative", hint: "Long-form" },
];

const EMPTY_SUGGESTIONS = [
  "Write a product description for a minimalist wireless keyboard",
  "Summarize our Q3 growth and suggest next steps",
  "Write a TypeScript function that debounces an input",
];

export default function ChatPage({ initialChatId, newChat, tplId }: { initialChatId: string | null; newChat: boolean; tplId: string | null }) {
  const router = useRouter();
  const { ready, chats, createChat, updateChat, toast, settings, workspaceId } = useApp();
  const [activeId, setActiveId] = useState<string | null>(initialChatId);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showJump, setShowJump] = useState(false);
  const threadRef = useRef<HTMLDivElement>(null);
  const didInit = useRef(false);
  const scrollLocked = useRef(false);

  const activeChat = useMemo(() => chats.find((c) => c.id === activeId) ?? null, [chats, activeId]);

  const doSend = useCallback(
    (chat: DemoChat, text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      const userMsg: ChatMsg = {
        id: `m-${Date.now()}-u`,
        role: "user",
        model: chat.model,
        blocks: [{ type: "text", text: trimmed }],
        createdAt: new Date().toISOString(),
      };
      const base = { ...chat, messages: [...chat.messages, userMsg], updatedAt: new Date().toISOString() };
      updateChat(base);
      scrollLocked.current = false;
      window.setTimeout(() => {
        const aiMsg: ChatMsg = {
          id: `m-${Date.now()}-a`,
          role: "ai",
          model: chat.model,
          blocks: mockReply(trimmed),
          createdAt: new Date().toISOString(),
        };
        updateChat({ ...base, messages: [...base.messages, aiMsg], updatedAt: new Date().toISOString() });
        setTyping(false);
      }, 650 + Math.random() * 500);
    },
    [updateChat]
  );

  useEffect(() => {
    if (didInit.current || !ready) return;
    didInit.current = true;
    const t = window.setTimeout(() => {
      if (tplId) {
        const tpl = templates.find((t) => t.id === tplId);
        const chat = createChat("pro");
        setActiveId(chat.id);
        if (tpl) setInput(tpl.prompt);
        router.replace("/chat", { scroll: false });
      } else if (newChat) {
        const chat = createChat("pro");
        setActiveId(chat.id);
        const preseed = window.sessionStorage.getItem("nexaai-summary-prompt");
        window.sessionStorage.removeItem("nexaai-summary-prompt");
        if (preseed) {
          setTyping(true);
          doSend(chat, preseed);
        }
        router.replace("/chat", { scroll: false });
      } else {
        const exists = initialChatId && chats.some((c) => c.id === initialChatId);
        setActiveId(exists ? initialChatId : chats[0]?.id ?? null);
      }
    }, 0);
    return () => window.clearTimeout(t);
  }, [ready, tplId, newChat, initialChatId, chats, createChat, doSend, router]);

  useEffect(() => {
    if (activeId && activeChat) {
      const base = `/chat?c=${activeId}`;
      if (window.location.search !== `?c=${activeId}`) router.replace(base, { scroll: false });
    }
  }, [activeId, activeChat, router]);

  useEffect(() => {
    if (!settings.autoScroll) return;
    const el = threadRef.current;
    if (!el) return;
    if (scrollLocked.current) {
      const near = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
      if (near) scrollLocked.current = false;
      return;
    }
    el.scrollTo({ top: el.scrollHeight });
  }, [settings.autoScroll, typing, activeChat?.messages.length, activeId]);

  const handleSend = useCallback(() => {
    if (typing || !input.trim()) return;
    const next = activeChat ?? createChat("pro");
    if (!activeChat) setActiveId(next.id);
    setInput("");
    setTyping(true);
    const titled = next.messages.length === 0 ? titleFromUserPrompt(input.trim()) : next.title;
    doSend({ ...next, title: titled }, input);
  }, [typing, input, activeChat, createChat, doSend]);

  const handleRegenerate = useCallback(() => {
    if (!activeChat || typing) return;
    const msgs = [...activeChat.messages];
    while (msgs.length && msgs[msgs.length - 1].role === "ai") msgs.pop();
    const lastUser = msgs[msgs.length - 1];
    if (!lastUser) return;
    const base = { ...activeChat, messages: msgs, updatedAt: new Date().toISOString() };
    updateChat(base);
    setTyping(true);
    window.setTimeout(() => {
      const aiMsg: ChatMsg = {
        id: `m-${Date.now()}-r`,
        role: "ai",
        model: base.model,
        blocks: mockReply(lastUser.blocks[0]?.type === "text" ? lastUser.blocks[0].text : "Summarize this"),
        createdAt: new Date().toISOString(),
      };
      updateChat({ ...base, messages: [...msgs, aiMsg], updatedAt: new Date().toISOString() });
      setTyping(false);
    }, 650 + Math.random() * 500);
  }, [activeChat, typing, updateChat]);

  const handleClear = useCallback(() => {
    if (!activeChat) return;
    updateChat({ ...activeChat, messages: [], updatedAt: new Date().toISOString() });
    toast("Conversation cleared", { variant: "info" });
  }, [activeChat, updateChat, toast]);

  if (!ready) {
    return (
      <div className="flex h-[calc(100dvh-56px)] items-center justify-center">
        <p className="text-sm text-ink-3">Loading workspaces…</p>
      </div>
    );
  }

  return (
    <div className="lg:h-[calc(100dvh-56px)]">
      <div className="grid lg:h-full lg:grid-cols-[240px_minmax(0,1fr)_290px]">
        {/* conversations — desktop */}
        <aside className="hidden min-h-0 border-r border-edge lg:block">
          <ConversationSidebar activeId={activeId} onSelect={(id) => setActiveId(id)} onNew={() => {
            const c = createChat("pro");
            setActiveId(c.id);
          }} />
        </aside>

        {/* main chat column */}
        <main className="flex min-h-[calc(100dvh-56px)] flex-col lg:min-h-0">
          <header className="flex items-center gap-2 border-b border-edge px-4 py-2.5">
            <button
              type="button"
              className="rounded-lg border border-edge p-2 text-ink-3 hover:bg-surface-2 lg:hidden"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open conversations"
            >
              <Menu className="h-4 w-4" />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="truncate font-display text-[14px] font-semibold text-ink">
                {activeChat ? activeChat.title : "New conversation"}
              </h1>
              <p className="flex items-center gap-1.5 text-[11px] text-ink-3">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ok opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-ok" />
                </span>
                {activeChat ? "Conversation" : "Ready"} · {workspaceId === "ali" ? "Ali's Workspace" : workspaceId === "nexastudio" ? "Nexa Studio" : "Personal"}
              </p>
            </div>
            <div className="hidden items-center gap-1 rounded-full border border-edge bg-surface-2/60 p-1 sm:flex">
              {MODELS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => activeChat && updateChat({ ...activeChat, model: m.id })}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-[11.5px] font-semibold transition-colors",
                    activeChat?.model === m.id ? "bg-accent text-white" : "text-ink-3 hover:text-ink"
                  )}
                  title={m.hint}
                >
                  {m.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={handleClear}
              disabled={!activeChat || activeChat.messages.length === 0}
              className="rounded-lg border border-edge p-2 text-ink-3 transition-colors hover:bg-surface-2 hover:text-danger disabled:opacity-40 lg:hidden"
              aria-label="Clear conversation"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          </header>

          <div
            ref={threadRef}
            onScroll={(e) => {
              const el = e.currentTarget;
              setShowJump(el.scrollHeight - el.scrollTop - el.clientHeight > 120);
            }}
            className="relative min-h-0 flex-1 overflow-y-auto px-3 py-4 sm:px-5"
          >
            {activeChat && activeChat.messages.length > 0 ? (
              <div className="mx-auto max-w-[780px] space-y-6">
                {activeChat.messages.map((m, i) => (
                  <MessageView
                    key={m.id}
                    msg={m}
                    isLast={i === activeChat.messages.length - 1 && !typing}
                    onRegenerate={m.role === "ai" && i === activeChat.messages.length - 1 ? handleRegenerate : undefined}
                  />
                ))}
                {typing && <TypingIndicator />}
              </div>
            ) : (
              <div className="mx-auto flex h-full max-w-[620px] flex-col items-center justify-center text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl brand-gradient shadow-lg shadow-accent/20">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h2 className="font-display text-xl font-bold text-ink">Ask anything. Start here.</h2>
                <p className="mt-1.5 text-sm text-ink-3">
                  {activeChat ? "NexaAI is ready — try a suggestion below." : "Choose a suggestion or pick a template to begin."}
                </p>
                <div className="mt-6 grid w-full gap-2.5">
                  {EMPTY_SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setInput(s);
                      }}
                      className="flex items-center gap-2.5 rounded-xl border border-edge bg-surface-2/50 px-4 py-3 text-left text-[13px] text-ink-2 transition-all hover:border-accent/30 hover:bg-accent-soft/40"
                    >
                      <MessageSquare className="h-3.5 w-3.5 shrink-0 text-accent" />
                      <span className="leading-snug">{s}</span>
                    </button>
                  ))}
                </div>
                <p className="mt-8 text-[11px] text-ink-3">Demonstration only — replies are generated locally.</p>
              </div>
            )}
            <button
              type="button"
              onClick={() => {
                scrollLocked.current = false;
                threadRef.current?.scrollTo({ top: threadRef.current?.scrollHeight, behavior: "smooth" });
              }}
              className={cn(
                "absolute bottom-4 right-5 rounded-full border border-edge bg-surface-2 p-2.5 text-ink-2 shadow-lg transition-all hover:bg-surface-3",
                showJump ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
              )}
              aria-label="Scroll to bottom"
            >
              <ArrowDown className="h-4 w-4" />
            </button>
          </div>

          {/* composer */}
          <div className="border-t border-edge px-3 py-3 sm:px-5">
            <div className="mx-auto max-w-[780px]">
              <div className="flex items-center gap-2 rounded-2xl border border-edge bg-surface-2/50 p-2 transition-colors focus-within:border-accent/50 sm:flex-col sm:items-stretch sm:gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  rows={1}
                  placeholder="Ask NexaAI anything…"
                  className="max-h-40 min-h-[24px] w-full resize-none bg-transparent px-2 py-1.5 text-[13.5px] text-ink placeholder:text-ink-3 focus:outline-none"
                />
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 rounded-full border border-edge p-0.5 sm:hidden">
                    {MODELS.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => activeChat && updateChat({ ...activeChat, model: m.id })}
                        className={cn(
                          "rounded-full px-2.5 py-1 text-[10.5px] font-semibold",
                          activeChat?.model === m.id ? "bg-accent text-white" : "text-ink-3"
                        )}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                  <Button size="sm" onClick={handleSend} disabled={!input.trim() || typing}>
                    <Send className="h-3.5 w-3.5" />
                    Send
                  </Button>
                </div>
              </div>
              <p className="mt-2 text-center text-[10.5px] text-ink-3">
                NexaAI can make mistakes — this is a local demo. Use <kbd className="rounded border border-edge bg-surface-2 px-1 font-sans">Ctrl K</kbd> to search.
              </p>
            </div>
          </div>
        </main>

        {/* context — desktop */}
        <aside className="hidden min-h-0 overflow-y-auto border-l border-edge lg:block">
          {activeChat ? (
            <ContextPanel chat={activeChat} onSuggest={(s) => {
              setInput(s);
            }} onClear={handleClear} />
          ) : (
            <div className="p-6 text-[12.5px] text-ink-3">
              Select a conversation on the left to inspect it.
            </div>
          )}
        </aside>
      </div>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} side="left" title="Conversations">
        <ConversationSidebar
          activeId={activeId}
          onSelect={(id) => {
            setActiveId(id);
            setDrawerOpen(false);
          }}
          onNew={() => {
            const c = createChat("pro");
            setActiveId(c.id);
            setDrawerOpen(false);
          }}
        />
      </Drawer>
    </div>
  );
}