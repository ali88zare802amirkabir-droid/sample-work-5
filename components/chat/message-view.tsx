"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Check, Copy, RefreshCw, Sparkles } from "lucide-react";
import type { ChatMsg, MsgBlock } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/store";
import { models } from "@/data/workspaces";
import { Avatar } from "@/components/ui/avatar";

export function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <p className="text-[13.5px] leading-relaxed text-ink" style={{ color: "var(--ink)" }}>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold text-ink" style={{ color: "var(--ink)" }}>
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </p>
  );
}

/* ---------------------------- miniature syntax ---------------------------- */

const TOKENIZERS: [RegExp, string][] = [
  [/(\/\/.*$)/gm, "tok-cm"],
  [/(\/\*[\s\S]*?\*\/)/g, "tok-cm"],
  [/("(?:[^"\\]|\\.)*")/g, "tok-str"],
  [/('(?:[^'\\]|\\.)*')/g, "tok-str"],
  [/\b(const|let|var|function|return|import|from|export|async|await|new|if|else|for|while|class|interface|type|extends|default|try|catch)\b/g, "tok-kw"],
  [/\b\d+(?:\.\d+)?\b/g, "tok-num"],
  [/<([\w-]+)/g, "tok-tag"],
];

function HighlightLine(line: string): ReactNode[] {
  let tree: { text: string; cls?: string }[] = [{ text: line, cls: undefined }];
  for (const [re, cls] of TOKENIZERS) {
    const next: { text: string; cls?: string }[] = [];
    for (const seg of tree) {
      if (seg.cls) {
        next.push(seg);
        continue;
      }
      const matches: { text: string; cls?: string }[] = [];
      let last = 0;
      let m: RegExpExecArray | null;
      re.lastIndex = 0;
      const local = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
      while ((m = local.exec(seg.text)) !== null) {
        if (m.index > last) matches.push({ text: seg.text.slice(last, m.index) });
        matches.push({ text: m[0], cls });
        last = m.index + m[0].length;
        if (m[0].length === 0) local.lastIndex++;
      }
      if (last < seg.text.length) matches.push({ text: seg.text.slice(last) });
      if (matches.length) next.push(...matches);
      else next.push(seg);
    }
    tree = next;
  }
  return tree.map((s, i) =>
    s.cls ? (
      <span key={i} className={s.cls}>
        {s.text}
      </span>
    ) : (
      <span key={i}>{s.text}</span>
    )
  );
}

function CodeBlock({ code, lang }: { code: string; lang: string }) {
  const [copied, setCopied] = useState(false);
  const lines = useMemo(() => code.split("\n"), [code]);
  return (
    <div className="overflow-hidden rounded-xl border border-edge bg-[#0d1220]">
      <div className="flex items-center justify-between border-b border-white/[0.06] bg-white/[0.02] px-3.5 py-2">
        <span className="text-[10.5px] font-semibold uppercase tracking-wider text-ink-3">{lang}</span>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard?.writeText(code);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1200);
          }}
          className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[11px] font-medium text-ink-3 transition-colors hover:bg-white/5 hover:text-ink"
        >
          {copied ? <Check className="h-3 w-3 text-ok" /> : <Copy className="h-3 w-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="code-area overflow-x-auto p-3.5">
        <code>
          {lines.map((l, i) => (
            <div key={i} className="whitespace-pre">
              {HighlightLine(l)}
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}

/* ------------------------------- block body ------------------------------- */

export function BlockBody({ block }: { block: MsgBlock }) {
  switch (block.type) {
    case "text":
      return <RichText text={block.text} />;
    case "heading":
      return <p className="font-display text-[14px] font-semibold text-ink">{block.text}</p>;
    case "bullets":
      return (
        <ul className="space-y-1.5">
          {block.items.map((it, i) => {
            const idx = /^\d+\.\s/.test(it);
            return (
              <li key={i} className="flex gap-2.5 text-[13.5px] leading-relaxed text-ink-2">
                <span
                  className={cn(
                    "mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full",
                    idx ? "bg-accent/50" : "bg-accent"
                  )}
                  style={{ backgroundColor: idx ? "color-mix(in srgb, var(--accent) 45%, transparent)" : "var(--accent)" }}
                />
                <span style={{ color: "var(--ink-2)" }}>
                  <RichText text={it} />
                </span>
              </li>
            );
          })}
        </ul>
      );
    case "callout":
      return (
        <div className="flex gap-2.5 rounded-xl border border-accent/20 bg-accent-soft p-3">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
          <p className="text-[12.5px] leading-relaxed text-ink-2">{block.text}</p>
        </div>
      );
    case "code":
      return <CodeBlock code={block.code} lang={block.lang} />;
    default:
      return null;
  }
}

/* -------------------------------- message -------------------------------- */

export function MessageView({ msg, onRegenerate, isLast }: { msg: ChatMsg; onRegenerate?: () => void; isLast?: boolean }) {
  const { settings, toast } = useApp();
  const model = models.find((m) => m.id === msg.model) ?? models[0];
  const plain = useMemo(() => {
    return msg.blocks
      .map((b) => {
        if (b.type === "code") return b.code;
        if (b.type === "bullets") return b.items.map((i) => `- ${i}`).join("\n");
        return b.text;
      })
      .join("\n\n");
  }, [msg.blocks]);

  if (msg.role === "user") {
    return (
      <div className="flex items-start gap-3">
        <Avatar name="Ali Varma" size="sm" seed={1} className="mt-0.5" />
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex items-baseline gap-2">
            <span className="text-[12.5px] font-semibold text-ink">Ali</span>
            <span className="text-[10.5px] text-ink-3">{model.name}</span>
          </div>
          <div className="card min-w-0 rounded-2xl rounded-tl-md bg-accent-soft/60 p-3.5">
            {msg.blocks.map((b, i) => (
              <BlockBody key={i} block={b} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg brand-gradient">
        <Sparkles className="h-3.5 w-3.5 text-white" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex items-baseline gap-2">
          <span className="text-[12.5px] font-semibold text-ink">NexaAI</span>
          <span className="text-[10.5px] text-ink-3">{model.name}</span>
        </div>
        <div className={cn("space-y-2.5", settings.animations && isLast && "animate-fade-up")}>
          {msg.blocks.map((b, i) => (
            <BlockBody key={i} block={b} />
          ))}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-1">
          {onRegenerate && (
            <button
              type="button"
              onClick={onRegenerate}
              className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-medium text-ink-3 transition-colors hover:bg-surface-2 hover:text-accent"
            >
              <RefreshCw className="h-3 w-3" />
              Regenerate
            </button>
          )}
          <button
            type="button"
            onClick={async () => {
              await navigator.clipboard?.writeText(plain);
              toast("Copied to clipboard", { desc: "Response copied", variant: "success" });
            }}
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-medium text-ink-3 transition-colors hover:bg-surface-2 hover:text-ink"
          >
            <Copy className="h-3 w-3" />
            Copy
          </button>
        </div>
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg brand-gradient">
        <Sparkles className="h-3.5 w-3.5 text-white" />
      </div>
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <div className="flex items-center gap-1 rounded-xl border border-edge bg-surface-2/70 px-3.5 py-3">
          <span className="h-1.5 w-1.5 animate-typing rounded-full bg-accent" />
          <span className="h-1.5 w-1.5 animate-typing rounded-full bg-accent [animation-delay:0.15s]" />
          <span className="h-1.5 w-1.5 animate-typing rounded-full bg-accent [animation-delay:0.3s]" />
        </div>
        <span className="text-[11.5px] text-ink-3">Nexa is thinking…</span>
      </div>
    </div>
  );
}