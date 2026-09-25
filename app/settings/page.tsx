"use client";

import { MonitorCog, Moon, RotateCcw, Sun, WandSparkles } from "lucide-react";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DemoNote } from "@/components/dashboard/widgets";

export default function SettingsPage() {
  const { settings, setSettings, toast } = useApp();

  const toggle = (key: keyof typeof settings) => setSettings({ [key]: !settings[key] });

  return (
    <div className="mx-auto max-w-[760px] space-y-6 px-4 sm:px-6">
      <div>
        <div className="mb-2"><DemoNote /></div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-ink">Settings</h1>
        <p className="mt-1 text-sm text-ink-3">Everything you change here takes effect immediately and stays in your browser.</p>
      </div>

      <section className="card p-5 sm:p-6">
        <h2 className="flex items-center gap-2 text-[15px] font-semibold text-ink">
          <MonitorCog className="h-4 w-4 text-accent" />
          Appearance
        </h2>
        <p className="mt-0.5 text-[12.5px] text-ink-3">Themes are scoped to this demo — no light-mode regrets.</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {(["dark", "light"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setSettings({ theme: t })}
              className={cn(
                "flex items-center gap-3 rounded-xl border p-4 text-left transition-all",
                settings.theme === t ? "border-accent/40 bg-accent-soft" : "border-edge hover:border-edge-strong"
              )}
            >
              <span className={cn("flex h-9 w-9 items-center justify-center rounded-lg", t === "dark" ? "bg-ink text-bg" : "bg-amber-100 text-amber-600")}>
                {t === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </span>
              <span>
                <span className="block text-[13px] font-semibold text-ink capitalize">{t} mode</span>
                <span className="block text-[11.5px] text-ink-3">{t === "dark" ? "Vortex default palette" : "Soft, high-key surfaces"}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="card p-5 sm:p-6">
        <h2 className="flex items-center gap-2 text-[15px] font-semibold text-ink">
          <WandSparkles className="h-4 w-4 text-accent" />
          Behavior
        </h2>
        <p className="mt-0.5 text-[12.5px] text-ink-3">Tune how the workspace looks and responds.</p>
        <div className="mt-2 divide-y divide-edge">
          <ToggleRow
            label="Compact density"
            hint="Tighter spacing across cards and sidebars"
            checked={settings.compact}
            onChange={() => toggle("compact")}
          />
          <ToggleRow
            label="Response animations"
            hint="Fade and slide-in motion for AI replies"
            checked={settings.animations}
            onChange={() => toggle("animations")}
          />
          <ToggleRow
            label="Auto-scroll on new messages"
            hint="Keep the chat pinned to the latest reply"
            checked={settings.autoScroll}
            onChange={() => toggle("autoScroll")}
          />
        </div>
      </section>

      <section className="card p-5 sm:p-6">
        <h2 className="text-[15px] font-semibold text-ink">Alerts</h2>
        <div className="mt-2 divide-y divide-edge">
          <ToggleRow
            label="In-app notifications"
            hint="Show a toast when a long task finishes"
            checked={settings.notifications}
            onChange={() => toggle("notifications")}
          />
        </div>
      </section>

      <section className="card border-danger/20 p-5 sm:p-6">
        <h2 className="text-[15px] font-semibold text-danger">Danger zone</h2>
        <p className="mt-0.5 text-[12.5px] text-ink-3">Wipe every local change and restore the seeded demo content.</p>
        <Button
          variant="ghost"
          className="mt-3 text-danger hover:bg-danger-soft hover:text-danger"
          onClick={() => {
            window.localStorage.removeItem("nexaai");
            toast("Demo data reset", { desc: "Reloading…", variant: "info" });
            window.setTimeout(() => window.location.reload(), 400);
          }}
        >
          <RotateCcw className="h-4 w-4" />
          Reset demo data
        </Button>
      </section>
    </div>
  );
}

function ToggleRow({ label, hint, checked, onChange }: { label: string; hint: string; checked: boolean; onChange: () => void }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <div>
        <p className="text-[13.5px] font-semibold text-ink">{label}</p>
        <p className="mt-0.5 text-[12px] text-ink-3">{hint}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-accent" : "bg-surface-3"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all",
            checked ? "left-[22px]" : "left-0.5"
          )}
        />
      </button>
    </div>
  );
}