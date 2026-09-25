"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { DemoChat, SettingsState, Toast, WorkspaceId } from "@/lib/types";
import { uid } from "@/lib/utils";
import { seededChats } from "@/data/conversations";

const STORAGE_KEY = "nexaai";
const DEFAULT_SETTINGS: SettingsState = {
  theme: "dark",
  compact: false,
  notifications: true,
  autoScroll: true,
  animations: true,
};

interface PersistedState {
  settings: SettingsState;
  workspaceId: WorkspaceId;
  chats: DemoChat[];
}

function pickPersisted(raw: unknown): PersistedState | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Partial<PersistedState>;
  if (!Array.isArray(r.chats) || !r.settings || !r.workspaceId) return null;
  const chatLen = r.chats.length;
  const clean: DemoChat[] = r.chats.filter(
    (c) => c && typeof c.id === "string" && Array.isArray(c.messages) && typeof c.title === "string"
  );
  if (clean.length !== chatLen) return null;
  return {
    settings: { ...DEFAULT_SETTINGS, ...r.settings },
    workspaceId: r.workspaceId as WorkspaceId,
    chats: clean,
  };
}

interface AppStore {
  ready: boolean;
  settings: SettingsState;
  setSettings: (patch: Partial<SettingsState>) => void;
  workspaceId: WorkspaceId;
  setWorkspace: (id: WorkspaceId) => void;
  chats: DemoChat[];
  createChat: (model: DemoChat["model"]) => DemoChat;
  updateChat: (chat: DemoChat) => void;
  deleteChat: (id: string) => void;
  toasts: Toast[];
  toast: (title: string, opts?: { desc?: string; variant?: Toast["variant"] }) => void;
  dismissToast: (id: string) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
}

const AppCtx = createContext<AppStore | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [settings, setSettingsState] = useState<SettingsState>(DEFAULT_SETTINGS);
  const [workspaceId, setWorkspaceId] = useState<WorkspaceId>("ali");
  const [chats, setChats] = useState<DemoChat[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const hydrated = useRef(false);

  useEffect(() => {
    const t = window.setTimeout(() => {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const state = raw ? (JSON.parse(raw) as unknown) : null;
      const p = pickPersisted(state);
      if (p) {
        setSettingsState(p.settings);
        setWorkspaceId(p.workspaceId);
        setChats(p.chats);
      } else {
        setChats(seededChats);
      }
      hydrated.current = true;
      setReady(true);
    }, 0);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const payload = JSON.stringify({ settings, workspaceId, chats });
    window.localStorage.setItem(STORAGE_KEY, payload);
  }, [ready, settings, workspaceId, chats]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("light", settings.theme === "light");
  }, [settings.theme]);

  const setSettings = useCallback((patch: Partial<SettingsState>) => {
    setSettingsState((s) => ({ ...s, ...patch }));
  }, []);

  const setWorkspace = useCallback((id: WorkspaceId) => {
    setWorkspaceId(id);
  }, []);

  const createChat = useCallback((model: DemoChat["model"]): DemoChat => {
    const chat: DemoChat = {
      id: uid("chat"),
      title: "New conversation",
      model,
      updatedAt: new Date().toISOString(),
      messages: [],
    };
    setChats((cs) => [chat, ...cs]);
    return chat;
  }, []);

  const updateChat = useCallback((chat: DemoChat) => {
    setChats((cs) => cs.map((c) => (c.id === chat.id ? chat : c)));
  }, []);

  const deleteChat = useCallback((id: string) => {
    setChats((cs) => cs.filter((c) => c.id !== id));
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((ts) => ts.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (title: string, opts?: { desc?: string; variant?: Toast["variant"] }) => {
      const id = uid("toast");
      setToasts((ts) => [...ts.slice(-3), { id, title, desc: opts?.desc, variant: opts?.variant ?? "success" }]);
      window.setTimeout(() => dismissToast(id), 3200);
    },
    [dismissToast]
  );

  return (
    <AppCtx.Provider
      value={{
        ready,
        settings,
        setSettings,
        workspaceId,
        setWorkspace,
        chats,
        createChat,
        updateChat,
        deleteChat,
        toasts,
        toast,
        dismissToast,
        searchOpen,
        setSearchOpen,
      }}
    >
      {children}
    </AppCtx.Provider>
  );
}

export function useApp(): AppStore {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}