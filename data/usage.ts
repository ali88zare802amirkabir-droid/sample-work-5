import type { ActivityItem } from "@/lib/types";

function minutesAgo(n: number): string {
  return new Date(Date.now() - n * 60000).toISOString();
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(10, 24, 0, 0);
  return d.toISOString();
}

export const recentActivity: ActivityItem[] = [
  { id: "act-1", text: "Generated a product description", when: minutesAgo(6), kind: "generate" },
  { id: "act-2", text: "Summarized Project Notes.txt", when: minutesAgo(42), kind: "summary" },
  { id: "act-3", text: "Created a marketing idea for the launch", when: minutesAgo(58), kind: "idea" },
  { id: "act-4", text: "Started a new AI project", when: minutesAgo(96), kind: "project" },
  { id: "act-5", text: "Uploaded Campaign Brief.pdf", when: minutesAgo(130), kind: "doc" },
  { id: "act-6", text: "Ran the Product Description template", when: daysAgo(1), kind: "template" },
  { id: "act-7", text: "Summarized quarterly review notes", when: daysAgo(2), kind: "summary" },
];

export const usageLast7 = [
  { label: "Sun", requests: 62, tokens: 41200 },
  { label: "Mon", requests: 148, tokens: 96400 },
  { label: "Tue", requests: 112, tokens: 84100 },
  { label: "Wed", requests: 196, tokens: 128300 },
  { label: "Thu", requests: 171, tokens: 117900 },
  { label: "Fri", requests: 263, tokens: 168400 },
  { label: "Sat", requests: 184, tokens: 132600 },
];

export const usage30d = [
  { label: "Aug 29", value: 3200 },
  { label: "Sep 5", value: 4100 },
  { label: "Sep 12", value: 3780 },
  { label: "Sep 19", value: 4900 },
  { label: "Sep 25", value: 5420 },
];

export const planUsage = {
  requestsUsed: 1784,
  requestsLimit: 2600,
  tokensUsed: 842000,
  tokensLimit: 2000000,
  endDate: "Oct 24, 2026",
};