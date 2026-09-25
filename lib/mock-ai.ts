import type { MsgBlock } from "@/lib/types";

/**
 * Tiny local demo "AI" — keyword-matched fictional responses.
 * No external API, no keys. Used purely for the portfolio demo.
 */
export function mockReply(prompt: string): MsgBlock[] {
  const q = prompt.toLowerCase();

  if (q.includes("product")) {
    return [
      { type: "text", text: "Here's a polished product description for a wireless keyboard — tuned for storefronts and social cards." },
      { type: "bullets", items: [
        "Type anywhere for up to 90 days on a single charge.",
        "Low-profile keys with a whisper-quiet, tactile feel.",
        "Seamless pairing across three devices at once.",
        "Aluminum frame, compact layout — a desk upgrade that lasts.",
      ] },
      { type: "callout", text: "Tip: pairing the short version above with a lifestyle photo tends to lift conversion around 18% in A/B tests." },
    ];
  }

  if (q.includes("marketing")) {
    return [
      { type: "text", text: "Here's a focused marketing angle for the launch — one narrative, three channels." },
      { type: "heading", text: "Launch narrative" },
      { type: "bullets", items: [
        "Core: put the *feeling* before the specs — comfort and focus first.",
        "Hero asset: a 15-second loop of the keyboard in a bright, calm workspace.",
        "Channel mix: 60% social creators, 25% niche communities, 15% email.",
      ] },
      { type: "callout", text: "Benchmark: similar launches see 2–4% email CTR and 1.5–2.5× ROAS on paid social by week two." },
    ];
  }

  if (q.includes("summary") || q.includes("summarize")) {
    return [
      { type: "text", text: "Here's a tight summary of that content — key points without the filler." },
      { type: "bullets", items: [
        "Problem: teams lose context across long chat threads and docs.",
        "Solution: a single workspace that ties conversations, files and notes together.",
        "Outcome: fewer status meetings, faster onboarding, one source of truth.",
      ] },
      { type: "callout", text: "Come back with a link or pasted doc and I can extend the summary to a one-pager." },
    ];
  }

  if (q.includes("code")) {
    return [
      { type: "text", text: "Here's a small, typed-up snippet for the task — a debounced async search with cleanup." },
      { type: "code", lang: "ts", code: `import { useEffect, useState } from "react";

export function useDebouncedSearch(query: string, delay = 300) {
  const [value, setValue] = useState(query);
  const [debounced, setDebounced] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer); // cancel on every keystroke
  }, [value, delay]);

  return { value, setValue, debounced };
}` },
      { type: "bullets", items: [
        "Debounces by 300ms and cleans up its own timer.",
        "Safe against unmount races and out-of-order responses.",
        "Drop it in any input that hits an async filter endpoint.",
      ] },
    ];
  }

  if (q.includes("email")) {
    return [
      { type: "text", text: "Here's a short outreach email draft with a friendly, low-pressure tone." },
      { type: "code", lang: "text", code: `Subject: Quick idea for your workspace

Hi there,

I noticed you're looking at AI workflows for your team.
We help small studios cut busywork with short, on-brand
prompts — happy to share a 5-minute walkthrough with
your real use case.

No strings attached. Just a demo.
— The NexaAI team` },
      { type: "callout", text: "Tip: personalize the first sentence with something specific — it lifts reply rates noticeably." },
    ];
  }

  if (q.includes("plan") || q.includes("outline") || q.includes("brief")) {
    return [
      { type: "text", text: "Here's a structured outline you can build on — sections, not sentences." },
      { type: "bullets", items: [
        "1. Context — the situation and why it matters now",
        "2. Goals — 2–3 measurable outcomes",
        "3. Approach — the core move and key risks",
        "4. Next steps — first actions with owners and timing",
      ] },
      { type: "callout", text: "Want the full brief version? Say “expand” and I'll add a paragraph under each section." },
    ];
  }

  return [
    { type: "text", text: "Here's where I landed on that — a practical take you can act on right away." },
    { type: "bullets", items: [
      "Start with the narrowest version of the task that still delivers value.",
      "Prototype it, then measure — one clear metric beats three fuzzy ones.",
      "Loop feedback in weekly, not when the milestone ships.",
    ] },
    { type: "callout", text: "This is a demo response — NexaAI simulates replies locally. Point me at a product, marketing, summary or code prompt for a tailored one." },
  ];
}

export function titleFromUserPrompt(prompt: string): string {
  const clean = prompt.trim().replace(/\s+/g, " ");
  if (clean.length <= 40) return clean;
  return `${clean.slice(0, 40).trim()}…`;
}

export function docSummary(name: string, keywords: string[]): MsgBlock[] {
  return [
    { type: "text", text: `I skimmed "${name}" and pulled the highlights into a quick summary.` },
    { type: "bullets", items: [
      `Core topic: ${keywords[0] ?? "the document's main subject"}.`,
      `Key points: ${(keywords.slice(1, 3) ?? []).join("; ") || "a clear problem/solution pair with concrete next actions."}`,
      `Tone: professional and action-oriented, with a short timeline proposed.`,
    ] },
    { type: "callout", text: "Demo summary — generated locally. No document content leaves this browser." },
  ];
}

export function projectBriefSummary(name: string): string {
  return `A concise recap of "${name}" so far: scope stays tight around a single launch block, the team converges on one narrative, and the docs folder keeps decisions traceable. Next milestone is the production cut of the hero asset.`;
}