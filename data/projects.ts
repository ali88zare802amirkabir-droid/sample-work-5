import type { Project, ProjectActivity, ProjectChatRef, ProjectDoc } from "@/lib/types";

function daysAgo(n: number, hourOffset = 0): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(10 + hourOffset, 24, 0, 0);
  return d.toISOString();
}

export const projects: Project[] = [
  {
    id: "marketing-campaign",
    name: "Marketing Campaign",
    desc: "Spring product launch across social, email and niche communities.",
    status: "Active",
    progress: 72,
    conversations: 3,
    documents: 3,
    updated: daysAgo(0),
    from: "#6fb4ff",
    to: "#38d3f0",
  },
  {
    id: "vortex-website",
    name: "Vortex Website",
    desc: "Studio site refresh — copy, structure and launch assets.",
    status: "Active",
    progress: 48,
    conversations: 2,
    documents: 2,
    updated: daysAgo(1),
    from: "#a78bfa",
    to: "#6fb4ff",
  },
  {
    id: "product-research",
    name: "Product Research",
    desc: "Competitive analysis and customer interviews for the next release.",
    status: "Active",
    progress: 35,
    conversations: 1,
    documents: 2,
    updated: daysAgo(2),
    from: "#34d399",
    to: "#38d3f0",
  },
  {
    id: "content-studio",
    name: "Content Studio",
    desc: "Editorial calendar, briefs and drafts for the blog and newsletter.",
    status: "Active",
    progress: 61,
    conversations: 1,
    documents: 2,
    updated: daysAgo(1),
    from: "#fbbf24",
    to: "#fb7185",
  },
  {
    id: "code-assistant",
    name: "Code Assistant",
    desc: "Internal GPT for docs, snippets and architecture Q&A.",
    status: "Paused",
    progress: 84,
    conversations: 1,
    documents: 1,
    updated: daysAgo(6),
    from: "#60a5fa",
    to: "#38bdf8",
  },
  {
    id: "client-onboarding",
    name: "Client Onboarding",
    desc: "A guided starter flow to get new workspaces running in minutes.",
    status: "Completed",
    progress: 100,
    conversations: 0,
    documents: 1,
    updated: daysAgo(9),
    from: "#38bdf8",
    to: "#34d399",
  },
];

export const projectChats: Record<string, ProjectChatRef[]> = {
  "marketing-campaign": [
    { id: "chat-campaign", title: "Spring product launch campaign", when: "2h ago", snippet: "One narrative, three channels — 60% creators, 25% communities…" },
    { id: "chat-keyboard", title: "Wireless keyboard product description", when: "4h ago", snippet: "Type anywhere for up to 90 days on a single charge…" },
    { id: "chat-email", title: "Cold outreach email for a studio", when: "1d ago", snippet: "Subject: Quick idea for your workspace…" },
  ],
  "vortex-website": [
    { id: "chat-persona", title: "Brand voice for an AI studio", when: "1d ago", snippet: "Calm, confident, never hypey — plain English…" },
    { id: "chat-deck", title: "Summarize quarterly review notes", when: "2d ago", snippet: "Fewer status meetings, one source of truth…" },
  ],
  "product-research": [
    { id: "chat-data", title: "Explain RAG in plain terms", when: "3d ago", snippet: "A librarian working next to a very fast writer…" },
  ],
  "content-studio": [
    { id: "chat-brief", title: "Draft a project brief skeleton", when: "2d ago", snippet: "Context, goals, approach, next steps…" },
  ],
  "code-assistant": [
    { id: "chat-metrics", title: "Build a reusable debounced search hook", when: "3d ago", snippet: "export function useDebouncedSearch(query, delay = 300)…" },
  ],
  "client-onboarding": [],
};

export const projectDocs: Record<string, ProjectDoc[]> = {
  "marketing-campaign": [
    { id: "pd-c-1", name: "Campaign Brief.pdf", type: "PDF", size: "1.2 MB", updated: "2h ago" },
    { id: "pd-c-2", name: "Spring Launch Plan.docx", type: "Word", size: "340 KB", updated: "1d ago" },
    { id: "pd-c-3", name: "Channel Notes.txt", type: "Text", size: "18 KB", updated: "2d ago" },
  ],
  "vortex-website": [
    { id: "pd-v-1", name: "Site Copy Draft.docx", type: "Word", size: "240 KB", updated: "1d ago" },
    { id: "pd-v-2", name: "Technical Spec.pdf", type: "PDF", size: "890 KB", updated: "3d ago" },
  ],
  "product-research": [
    { id: "pd-p-1", name: "Interview Findings.pdf", type: "PDF", size: "1.8 MB", updated: "2d ago" },
    { id: "pd-p-2", name: "Competitor Matrix.xlsx", type: "Sheet", size: "96 KB", updated: "4d ago" },
  ],
  "content-studio": [
    { id: "pd-s-1", name: "Editorial Calendar.xlsx", type: "Sheet", size: "120 KB", updated: "1d ago" },
    { id: "pd-s-2", name: "Newsletter Draft.docx", type: "Word", size: "180 KB", updated: "3d ago" },
  ],
  "code-assistant": [
    { id: "pd-a-1", name: "Architecture Notes.md", type: "Markdown", size: "64 KB", updated: "5d ago" },
  ],
  "client-onboarding": [
    { id: "pd-o-1", name: "Onboarding Checklist.pdf", type: "PDF", size: "410 KB", updated: "9d ago" },
  ],
};

export const projectActivity: Record<string, ProjectActivity[]> = {
  "marketing-campaign": [
    { id: "pa-c-1", text: "Generated a product description for the launch", when: "45m ago", kind: "chat" },
    { id: "pa-c-2", text: "Uploaded Campaign Brief.pdf", when: "2h ago", kind: "doc" },
    { id: "pa-c-3", text: "Switched project model to Nexa Creative", when: "3h ago", kind: "model" },
    { id: "pa-c-4", text: "Edited channel plan in Spring Launch Plan", when: "1d ago", kind: "edit" },
  ],
  "vortex-website": [
    { id: "pa-v-1", text: "Defined a studio brand voice", when: "5h ago", kind: "chat" },
    { id: "pa-v-2", text: "Merged site copy draft v2", when: "1d ago", kind: "edit" },
  ],
  "product-research": [
    { id: "pa-p-1", text: "Summarized interview findings with AI", when: "3h ago", kind: "chat" },
    { id: "pa-p-2", text: "Added Competitor Matrix.xlsx", when: "4d ago", kind: "doc" },
  ],
  "content-studio": [
    { id: "pa-s-1", text: "Drafted a newsletter outline", when: "6h ago", kind: "chat" },
    { id: "pa-s-2", text: "Updated Editorial Calendar", when: "1d ago", kind: "edit" },
  ],
  "code-assistant": [],
  "client-onboarding": [
    { id: "pa-o-1", text: "Project marked complete", when: "9d ago", kind: "edit" },
  ],
};