import type { DemoChat } from "@/lib/types";

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function minutesAgo(n: number): string {
  return new Date(Date.now() - n * 60000).toISOString();
}

export const seededChats: DemoChat[] = [
  {
    id: "chat-keyboard",
    title: "Wireless keyboard product description",
    model: "pro",
    updatedAt: minutesAgo(12),
    messages: [
      {
        id: "m-kb-1",
        role: "user",
        model: "pro",
        createdAt: minutesAgo(15),
        blocks: [{ type: "text", text: "Create a short product description for a wireless keyboard." }],
      },
      {
        id: "m-kb-2",
        role: "ai",
        model: "pro",
        createdAt: minutesAgo(14),
        blocks: [
          { type: "text", text: "Here's a polished product description for a wireless keyboard — tuned for storefronts and social cards." },
          {
            type: "bullets",
            items: [
              "Type anywhere for up to 90 days on a single charge.",
              "Low-profile keys with a whisper-quiet, tactile feel.",
              "Seamless pairing across three devices at once.",
              "Aluminum frame, compact layout — a desk upgrade that lasts.",
            ],
          },
          { type: "callout", text: "Tip: pairing the short version with a lifestyle photo tends to lift conversion around 18% in A/B tests." },
        ],
      },
    ],
  },
  {
    id: "chat-email",
    title: "Cold outreach email for a studio",
    model: "fast",
    updatedAt: minutesAgo(180),
    messages: [
      {
        id: "m-em-1",
        role: "user",
        model: "fast",
        createdAt: minutesAgo(182),
        blocks: [{ type: "text", text: "Write a short, friendly cold outreach email for a small studio." }],
      },
      {
        id: "m-em-2",
        role: "ai",
        model: "fast",
        createdAt: minutesAgo(181),
        blocks: [
          { type: "text", text: "Here's a short outreach draft with a friendly, low-pressure tone." },
          {
            type: "code",
            lang: "text",
            code: `Subject: Quick idea for your workspace

Hi there,

I noticed you're looking at AI workflows for your team.
We help small studios cut busywork with short, on-brand
prompts — happy to share a 5-minute walkthrough with
your real use case.

No strings attached. Just a demo.
— The NexaAI team`,
          },
        ],
      },
    ],
  },
  {
    id: "chat-metrics",
    title: "Build a reusable debounced search hook",
    model: "fast",
    updatedAt: minutesAgo(40),
    messages: [
      {
        id: "m-mt-1",
        role: "user",
        model: "fast",
        createdAt: minutesAgo(42),
        blocks: [{ type: "text", text: "Can you give me a small TypeScript hook that debounces a search input?" }],
      },
      {
        id: "m-mt-2",
        role: "ai",
        model: "fast",
        createdAt: minutesAgo(41),
        blocks: [
          { type: "text", text: "Here's a small, typed-up snippet — a debounced async search with cleanup." },
          {
            type: "code",
            lang: "ts",
            code: `import { useEffect, useState } from "react";

export function useDebouncedSearch(query: string, delay = 300) {
  const [value, setValue] = useState(query);
  const [debounced, setDebounced] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer); // cancel on every keystroke
  }, [value, delay]);

  return { value, setValue, debounced };
}`,
          },
          {
            type: "bullets",
            items: [
              "Debounces by 300ms and cleans up its own timer.",
              "Safe against unmount races and out-of-order responses.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "chat-campaign",
    title: "Spring product launch campaign",
    model: "creative",
    updatedAt: minutesAgo(65),
    messages: [
      {
        id: "m-cp-1",
        role: "user",
        model: "creative",
        createdAt: minutesAgo(70),
        blocks: [{ type: "text", text: "Help me brainstorm a marketing angle for a spring product launch." }],
      },
      {
        id: "m-cp-2",
        role: "ai",
        model: "creative",
        createdAt: minutesAgo(69),
        blocks: [
          { type: "text", text: "Here's a focused marketing angle — one narrative, three channels." },
          { type: "heading", text: "Launch narrative" },
          {
            type: "bullets",
            items: [
              "Core: put the *feeling* before the specs — comfort and focus first.",
              "Hero asset: a 15-second loop of the product in a bright, calm workspace.",
              "Channel mix: 60% social creators, 25% niche communities, 15% email.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "chat-deck",
    title: "Summarize quarterly review notes",
    model: "pro",
    updatedAt: minutesAgo(95),
    messages: [
      {
        id: "m-dk-1",
        role: "user",
        model: "pro",
        createdAt: minutesAgo(98),
        blocks: [{ type: "text", text: "Summarize the key decisions from the quarterly review notes." }],
      },
      {
        id: "m-dk-2",
        role: "ai",
        model: "pro",
        createdAt: minutesAgo(97),
        blocks: [
          { type: "text", text: "Here's a tight summary — key points without the filler." },
          {
            type: "bullets",
            items: [
              "Problem: teams lose context across long chat threads and docs.",
              "Solution: a single workspace that ties conversations, files and notes together.",
              "Outcome: fewer status meetings, faster onboarding, one source of truth.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "chat-brief",
    title: "Draft a project brief skeleton",
    model: "pro",
    updatedAt: daysAgo(1),
    messages: [
      {
        id: "m-br-1",
        role: "user",
        model: "pro",
        createdAt: daysAgo(1),
        blocks: [{ type: "text", text: "Draft an outline for a product launch project brief." }],
      },
      {
        id: "m-br-2",
        role: "ai",
        model: "pro",
        createdAt: daysAgo(1),
        blocks: [
          {
            type: "bullets",
            items: [
              "1. Context — the situation and why it matters now",
              "2. Goals — 2–3 measurable outcomes",
              "3. Approach — the core move and key risks",
              "4. Next steps — first actions with owners and timing",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "chat-data",
    title: "Explain RAG in plain terms",
    model: "fast",
    updatedAt: daysAgo(2),
    messages: [
      {
        id: "m-dt-1",
        role: "user",
        model: "fast",
        createdAt: daysAgo(2),
        blocks: [{ type: "text", text: "Explain retrieval-augmented generation to a non-technical teammate." }],
      },
      {
        id: "m-dt-2",
        role: "ai",
        model: "fast",
        createdAt: daysAgo(2),
        blocks: [
          { type: "text", text: "Think of it as a librarian working next to a very fast writer. The model pulls only the relevant passages, then answers from that material." },
          { type: "callout", text: "Demo response — simulated locally inside the browser." },
        ],
      },
    ],
  },
  {
    id: "chat-persona",
    title: "Brand voice for an AI studio",
    model: "creative",
    updatedAt: daysAgo(3),
    messages: [
      {
        id: "m-pe-1",
        role: "user",
        model: "creative",
        createdAt: daysAgo(3),
        blocks: [{ type: "text", text: "Define a brand voice for a small AI studio." }],
      },
      {
        id: "m-pe-2",
        role: "ai",
        model: "creative",
        createdAt: daysAgo(3),
        blocks: [
          {
            type: "bullets",
            items: [
              "Tone: calm, confident, never hypey.",
              "Default voice: plain English with precise product language.",
              "Cold open: lead with the customer's outcome, never the tech.",
            ],
          },
        ],
      },
    ],
  },
];