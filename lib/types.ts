export type WorkspaceId = "ali" | "nexastudio" | "personal";

export interface Workspace {
  id: WorkspaceId;
  name: string;
  meta: string;
  initials: string;
  plan: string;
}

export type ModelId = "fast" | "pro" | "creative";

export interface ModelOption {
  id: ModelId;
  name: string;
  tag: string;
  desc: string;
}

export type MsgBlock =
  | { type: "text"; text: string }
  | { type: "bullets"; items: string[] }
  | { type: "callout"; text: string }
  | { type: "code"; lang: string; code: string }
  | { type: "heading"; text: string };

export interface ChatMsg {
  id: string;
  role: "user" | "ai";
  model: ModelId;
  blocks: MsgBlock[];
  createdAt: string;
}

export interface DemoChat {
  id: string;
  title: string;
  model: ModelId;
  updatedAt: string;
  messages: ChatMsg[];
}

export type ProjectStatus = "Active" | "Paused" | "Completed";

export interface Project {
  id: string;
  name: string;
  desc: string;
  status: ProjectStatus;
  progress: number;
  conversations: number;
  documents: number;
  updated: string;
  from: string;
  to: string;
}

export interface ProjectChatRef {
  id: string;
  title: string;
  when: string;
  snippet: string;
}

export interface ProjectDoc {
  id: string;
  name: string;
  type: string;
  size: string;
  updated: string;
}

export interface ProjectActivity {
  id: string;
  text: string;
  when: string;
  kind: "chat" | "doc" | "model" | "edit";
}

export interface AiDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  updated: string;
  status: "Processed" | "Synced" | "Draft";
  summary?: string;
  content: string[];
}

export type TemplateCategory = "Writing" | "Marketing" | "Development" | "Business" | "Education";

export interface Template {
  id: string;
  title: string;
  desc: string;
  category: TemplateCategory;
  uses: number;
  prompt: string;
}

export interface ActivityItem {
  id: string;
  text: string;
  when: string;
  kind: "generate" | "summary" | "idea" | "project" | "doc" | "template";
}

export type SettingsState = {
  theme: "dark" | "light";
  compact: boolean;
  notifications: boolean;
  autoScroll: boolean;
  animations: boolean;
};

export interface Toast {
  id: string;
  title: string;
  desc?: string;
  variant: "success" | "info" | "danger";
}