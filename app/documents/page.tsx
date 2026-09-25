"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Search, Sparkles, WandSparkles, X } from "lucide-react";
import { documents } from "@/data/documents";
import { docSummary } from "@/lib/mock-ai";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { BlockBody } from "@/components/chat/message-view";
import { DemoNote } from "@/components/dashboard/widgets";
import type { MsgBlock } from "@/lib/types";

const TYPE_TONE: Record<string, "accent" | "ok" | "warn" | "muted"> = {
  PDF: "accent",
  Word: "ok",
  Text: "muted",
  Sheet: "warn",
  Markdown: "accent",
};

export default function DocumentsPage() {
  return <DocumentsInner />;
}

function DocumentsInner() {
  const router = useRouter();
  const { toast } = useApp();
  const [q, setQ] = useState("");
  const [type, setType] = useState<string>("All");
  const [openId, setOpenId] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    const doc = new URLSearchParams(window.location.search).get("doc");
    return doc && documents.some((d) => d.id === doc) ? doc : null;
  });
  const [summarizing, setSummarizing] = useState(false);
  const [summaryBlocks, setSummaryBlocks] = useState<MsgBlock[] | null>(null);

  const types = useMemo(() => ["All", ...Array.from(new Set(documents.map((d) => d.type)))], []);
  const list = documents.filter(
    (d) =>
      (type === "All" || d.type === type) &&
      (d.name + d.summary + d.content.join(" ")).toLowerCase().includes(q.trim().toLowerCase())
  );

  const openDoc = documents.find((d) => d.id === openId) ?? null;

  const closePreview = useCallback(() => {
    setOpenId(null);
    setSummaryBlocks(null);
    setSummarizing(false);
    router.replace("/documents", { scroll: false });
  }, [router]);

  const runSummarize = () => {
    if (!openDoc || summarizing) return;
    setSummarizing(true);
    setSummaryBlocks(null);
    window.setTimeout(() => {
      setSummaryBlocks(docSummary(openDoc.name, openDoc.content));
      setSummarizing(false);
    }, 1000);
  };

  return (
    <div className="mx-auto max-w-[1100px] space-y-6 px-4 sm:px-6">
      <div>
        <div className="mb-2"><DemoNote /></div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-ink">Documents</h1>
        <p className="mt-1 text-sm text-ink-3">{documents.length} files in your workspace — open one to read it or summarize it with AI.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search documents"
            className="h-10 w-full rounded-xl border border-edge bg-surface-2/60 pl-9 pr-3 text-[13px] text-ink placeholder:text-ink-3 focus:border-accent/40 focus:outline-none"
          />
        </div>
        <div className="flex gap-1 overflow-x-auto rounded-full border border-edge bg-surface-2/60 p-1">
          {types.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={cn(
                "whitespace-nowrap rounded-full px-3.5 py-1.5 text-[11.5px] font-semibold transition-colors",
                type === t ? "bg-accent text-white" : "text-ink-3 hover:text-ink"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {list.length === 0 ? (
        <div className="card flex flex-col items-center justify-center gap-2 py-16 text-center">
          <FileText className="h-8 w-8 text-ink-3" />
          <p className="text-sm font-medium text-ink">No documents match</p>
          <p className="text-xs text-ink-3">Try a different search or type filter.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => {
                setOpenId(d.id);
                setSummaryBlocks(null);
                router.replace(`/documents?doc=${d.id}`, { scroll: false });
              }}
              className="card group flex flex-col p-4 text-left transition-all hover:-translate-y-0.5 hover:border-edge-strong"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-soft text-cyan">
                  <FileText className="h-4 w-4" />
                </span>
                <Badge tone={TYPE_TONE[d.type]}>{d.type}</Badge>
              </div>
              <h2 className="mt-3 truncate text-[13.5px] font-semibold text-ink group-hover:text-accent">{d.name}</h2>
              <p className="mt-1 line-clamp-2 flex-1 text-[12px] leading-relaxed text-ink-3">{d.summary}</p>
              <div className="mt-3 flex items-center gap-2 text-[11px] text-ink-3">
                <span>{d.size}</span>
                <span className="h-1 w-1 rounded-full bg-ink-3/50" />
                <span className={cn(d.status === "Draft" && "text-warn")}>{d.status}</span>
                <span className="ml-auto">{d.updated}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      <Modal
        open={!!openDoc}
        onClose={closePreview}
        title={openDoc?.name ?? "Document"}
        titleNode={
          openDoc && (
            <div className="flex items-center gap-2">
              <span>{openDoc.name}</span>
              <Badge tone={TYPE_TONE[openDoc.type]}>{openDoc.type}</Badge>
            </div>
          )
        }
        size="xl"
      >
        {openDoc && (
          <div>
            {summarizing ? (
              <div className="flex items-center gap-3 rounded-xl border border-edge bg-surface-2/60 px-4 py-5">
                <span className="h-2 w-2 animate-ping rounded-full bg-accent" />
                <span className="text-[13px] text-ink-2">Summarizing with NexaAI…</span>
              </div>
            ) : summaryBlocks ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge tone="accent">AI summary · {openDoc.name}</Badge>
                  <button
                    type="button"
                    onClick={() => {
                      const text = summaryBlocks.map((b) => {
                        if (b.type === "bullets") return b.items.map((i) => `- ${i}`).join("\n");
                        if (b.type === "code") return b.code;
                        return b.text;
                      }).join("\n\n");
                      navigator.clipboard?.writeText(text);
                      toast("Summary copied", { variant: "success" });
                    }}
                    className="text-[11.5px] font-medium text-accent hover:underline"
                  >
                    Copy summary
                  </button>
                </div>
                {summaryBlocks.map((b, i) => (
                  <BlockBody key={i} block={b} />
                ))}
              </div>
            ) : (
              <div className="space-y-2.5">
                {openDoc.content.map((line, i) => (
                  <p key={i} className={cn("text-[13px] leading-relaxed", line.length && line === line.toUpperCase() ? "font-semibold text-ink" : "text-ink-2")}>
                    {line}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
        <div className="flex items-center justify-between border-t border-edge px-5 py-3.5">
          <p className="text-[11.5px] text-ink-3">{openDoc?.status} · {openDoc?.size} · {openDoc?.updated}</p>
          <div className="flex items-center gap-2">
            {summaryBlocks && openDoc && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  window.sessionStorage.setItem(
                    "nexaai-summary-prompt",
                    `Summarize the document "${openDoc.name}" for me — include the key decisions and next actions.`
                  );
                  toast("Summary context queued", { desc: "Opening chat…", variant: "info" });
                  router.push("/chat?new=1");
                }}
              >
                Open in chat
              </Button>
            )}
            {!summarizing && (!summaryBlocks || true) && (
              <Button size="sm" onClick={runSummarize} disabled={summarizing}>
                {summaryBlocks ? <WandSparkles className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
                {summaryBlocks ? "Summarize again" : "Summarize with AI"}
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={closePreview}>
              <X className="h-3.5 w-3.5" />
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}