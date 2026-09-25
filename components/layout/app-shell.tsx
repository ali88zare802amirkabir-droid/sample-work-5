"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  Check,
  ChevronsUpDown,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings,
  SlidersHorizontal,
  Sparkles,
  Store,
  Users,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import { workspaces } from "@/data/workspaces";
import { Drawer } from "@/components/ui/drawer";
import { Modal } from "@/components/ui/modal";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const NAV = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/chat", label: "AI Chat", icon: MessageSquare },
  { href: "/projects", label: "Projects", icon: Store },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/usage", label: "Usage", icon: SlidersHorizontal },
  { href: "/templates", label: "Templates", icon: Sparkles },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { workspaceId, setSearchOpen, settings } = useApp();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);

  const workspace = workspaces.find((w) => w.id === workspaceId) ?? workspaces[0];

  useEffect(() => {
    const t = window.setTimeout(() => setMobileOpen(false), 0);
    return () => window.clearTimeout(t);
  }, [pathname]);

  const activeFor = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <div
      className={cn(
        "app-bg min-h-screen text-ink",
        settings.compact && "is-compact",
        !settings.animations && "no-anim"
      )}
    >
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-edge bg-surface/55 backdrop-blur-xl transition-[width] duration-200 lg:flex",
          collapsed ? "w-[72px]" : "w-[248px]"
        )}
      >
        <div className={cn("flex items-center gap-2.5 px-4 pt-5 pb-4", collapsed && "justify-center px-0")}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl brand-gradient shadow-[0_6px_18px_-8px_rgba(56,132,255,0.7)]">
            <Bot className="h-4.5 w-4.5 text-white" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="font-display text-[15px] font-bold leading-none text-ink">NexaAI</p>
              <p className="mt-1 text-[10.5px] font-medium text-ink-3">Interactive demo</p>
            </div>
          )}
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-2.5 pt-1">
          {NAV.map((item) => {
            const active = activeFor(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium transition-colors",
                  collapsed && "justify-center px-0",
                  active ? "bg-accent-soft text-accent" : "text-ink-2 hover:bg-surface-2 hover:text-ink"
                )}
              >
                <item.icon className={cn("h-4.5 w-4.5 shrink-0", active && "text-accent")} />
                {!collapsed && <span className="truncate">{item.label}</span>}
                {active && !collapsed && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent" />}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-edge p-2.5">
          <button
            type="button"
            onClick={() => setSwitcherOpen(true)}
            className={cn(
              "flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition-colors hover:bg-surface-2",
              collapsed && "justify-center px-0"
            )}
            title={collapsed ? workspace.name : undefined}
          >
            <Avatar name={workspace.initials} seed={0} className="h-8 w-8 text-[10.5px]" />
            {!collapsed && (
              <>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12.5px] font-semibold text-ink">{workspace.name}</p>
                  <p className="truncate text-[10.5px] text-ink-3">{workspace.plan}</p>
                </div>
                <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-ink-3" />
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className={cn(
              "mt-1 flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[12.5px] text-ink-3 transition-colors hover:bg-surface-2 hover:text-ink",
              collapsed && "justify-center px-0"
            )}
          >
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            {!collapsed && <span>Collapse sidebar</span>}
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)} side="left" title="NexaAI">
        <div className="flex flex-col gap-0.5 p-2.5">
          <div className="mb-1 flex items-center gap-2 px-2 pb-2 pt-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg brand-gradient">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <Badge tone="accent">Interactive demo</Badge>
          </div>
          {NAV.map((item) => {
            const active = activeFor(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium",
                  active ? "bg-accent-soft text-accent" : "text-ink-2 hover:bg-surface-2 hover:text-ink"
                )}
              >
                <item.icon className="h-4.5 w-4.5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </Drawer>

      {/* Main column */}
      <div className={cn("transition-[padding] duration-200", collapsed ? "lg:pl-[72px]" : "lg:pl-[248px]")}>
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-edge bg-bg/55 px-4 backdrop-blur-xl sm:px-6">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-ink-2 transition-colors hover:bg-surface-2 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-4.5 w-4.5" />
          </button>
          <div className="flex items-center gap-2 lg:hidden">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg brand-gradient">
              <Bot className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-display text-[14px] font-bold text-ink">NexaAI</span>
          </div>

          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="ml-auto flex w-full max-w-sm items-center gap-2.5 rounded-xl border border-edge bg-surface-2/60 px-3.5 py-2 text-[12.5px] text-ink-3 transition-all hover:border-edge-strong hover:bg-surface-2"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Search anywhere…</span>
            <span className="ml-auto hidden sm:inline-flex">
              <kbd className="kbd">Ctrl</kbd>
              <span className="mx-1 text-ink-3">+</span>
              <kbd className="kbd">K</kbd>
            </span>
          </button>

          <div className="ml-auto flex items-center gap-2 sm:ml-0">
            <Badge tone="muted" className="hidden md:inline-flex">
              <Sparkles className="h-3 w-3 text-cyan" />
              Demo
            </Badge>
            <div className="flex items-center gap-2">
              <Users className="hidden h-4 w-4 text-ink-3 sm:block" />
              <Avatar name="Ali Varma" size="sm" seed={1} />
            </div>
          </div>
        </header>

        <main className="pb-16 pt-6">{children}</main>
      </div>

      <WorkspaceSwitcher open={switcherOpen} onClose={() => setSwitcherOpen(false)} />
    </div>
  );
}

function WorkspaceSwitcher({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { workspaceId, setWorkspace, toast } = useApp();
  return (
    <Modal open={open} onClose={onClose} title="Switch workspace">
      <div className="space-y-1.5 p-3">
        {workspaces.map((w) => {
          const active = w.id === workspaceId;
          return (
            <button
              key={w.id}
              type="button"
              onClick={() => {
                setWorkspace(w.id);
                onClose();
                toast("Workspace switched", { desc: `Now viewing ${w.name}.`, variant: "info" });
              }}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors",
                active ? "border-accent/35 bg-accent-soft" : "border-edge hover:bg-surface-2"
              )}
            >
              <Avatar name={w.initials} seed={w.id === "ali" ? 0 : w.id === "nexastudio" ? 1 : 2} />
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-ink">{w.name}</p>
                <p className="text-[11px] text-ink-3">{w.meta}</p>
              </div>
              {active && <Check className="h-4 w-4 text-accent" />}
            </button>
          );
        })}
        <p className="pt-2 text-center text-[11px] text-ink-3">
          Workspace selection is local to this demo — no backend.
        </p>
      </div>
    </Modal>
  );
}