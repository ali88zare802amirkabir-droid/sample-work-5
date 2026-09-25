import type { ModelOption, Workspace } from "@/lib/types";

export const workspaces: Workspace[] = [
  { id: "ali", name: "Ali's Workspace", meta: "Team of 3 · Pro plan", initials: "AV", plan: "Nexa Pro" },
  { id: "nexastudio", name: "Nexa Studio", meta: "Studio · Pro plan", initials: "NX", plan: "Nexa Pro" },
  { id: "personal", name: "Personal", meta: "Personal · Free plan", initials: "P", plan: "Nexa Free" },
];

export const models: ModelOption[] = [
  { id: "fast", name: "Nexa Fast", tag: "typical", desc: "Quick replies for everyday tasks" },
  { id: "pro", name: "Nexa Pro", tag: "balanced", desc: "Best for analysis and long-form work" },
  { id: "creative", name: "Nexa Creative", tag: "imaginative", desc: "Ideation, tone and storytelling" },
];