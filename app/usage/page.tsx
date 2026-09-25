"use client";

import { useState } from "react";
import { Bot, CalendarDays, CreditCard, Gauge, Sparkles, Zap } from "lucide-react";
import { planUsage, usage30d, usageLast7 } from "@/data/usage";
import { formatNum } from "@/lib/utils";
import { useApp } from "@/lib/store";
import { AreaChart, BarChart, RingChart } from "@/components/ui/charts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { DemoNote } from "@/components/dashboard/widgets";

export default function UsagePage() {
  const { toast } = useApp();
  const [manageOpen, setManageOpen] = useState(false);
  const reqPct = Math.round((planUsage.requestsUsed / planUsage.requestsLimit) * 100);
  const tokPct = Math.round((planUsage.tokensUsed / planUsage.tokensLimit) * 100);
  const weekTotals = usageLast7.reduce((a, d) => ({ requests: a.requests + d.requests, tokens: a.tokens + d.tokens }), { requests: 0, tokens: 0 });
  const peak = usageLast7.reduce((a, b) => (b.requests > a.requests ? b : a), usageLast7[0]);

  return (
    <div className="mx-auto max-w-[1100px] space-y-6 px-4 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-2"><DemoNote /></div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink">Usage</h1>
          <p className="mt-1 text-sm text-ink-3">How much of the Nexa Pro plan this workspace has used this cycle.</p>
        </div>
        <Button onClick={() => setManageOpen(true)}>
          <CreditCard className="h-4 w-4" />
          Manage plan
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        <div className="card relative p-4">
          <CCircle pct={reqPct} accent="#6fb4ff" label={`${formatNum(planUsage.requestsUsed)} / ${formatNum(planUsage.requestsLimit)}`} sub="Requests" icon={<Gauge className="h-4 w-4" />} />
        </div>
        <div className="card relative p-4">
          <CCircle pct={tokPct} accent="#a78bfa" label={`${(planUsage.tokensUsed / 1_000_000).toFixed(1)}M / ${(planUsage.tokensLimit / 1_000_000).toFixed(0)}M`} sub="Tokens" icon={<Bot className="h-4 w-4" />} />
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-ink-3">
            <Zap className="h-3.5 w-3.5 text-accent" /> This week
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-ink">{formatNum(weekTotals.requests)}</p>
          <p className="mt-1 text-[12px] text-ink-3">requests · +18% vs last week</p>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-ink-3">
            <CalendarDays className="h-3.5 w-3.5 text-cyan" /> Cycle reset
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-ink">Oct 24</p>
          <p className="mt-1 text-[12px] text-ink-3">plan renews for a new month</p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-[15px] font-semibold text-ink">Requests, last 30 days</h2>
              <p className="text-[12px] text-ink-3">{formatNum(usage30d.reduce((s, d) => s + d.value, 0))} total</p>
            </div>
            <Badge tone="muted">All models</Badge>
          </div>
          <AreaChart data={usage30d} />
        </div>
        <div className="card p-5">
          <h2 className="text-[15px] font-semibold text-ink">Last 7 days</h2>
          <div className="mt-4">
            <BarChart data={usageLast7.map((d) => ({ label: d.label, value: d.requests }))} />
          </div>
          <p className="mt-3 text-[11.5px] text-ink-3">Requests by weekday. Peak: {peak.label} with {formatNum(peak.requests)} — the launch push.</p>
        </div>
      </div>

      <div className="card p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg brand-gradient">
                <Sparkles className="h-4 w-4 text-white" />
              </span>
              <div>
                <p className="font-display text-[16px] font-semibold text-ink">Nexa Pro</p>
                <p className="text-[12px] text-ink-3">Billed monthly · renews {planUsage.endDate}</p>
              </div>
            </div>
            <p className="mt-3 max-w-xl text-[13px] leading-relaxed text-ink-2">
              You&apos;re using about <b className="text-ink">{reqPct}%</b> of your request allowance and <b className="text-ink">{tokPct}%</b> of tokens. At this pace you have plenty of headroom for the rest of the cycle.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => toast("Demo action", { desc: "Upgrade flow is disabled in this showcase.", variant: "info" })}>
              Upgrade
            </Button>
            <Button onClick={() => setManageOpen(true)}>Manage plan</Button>
          </div>
        </div>
      </div>

      <Modal open={manageOpen} onClose={() => setManageOpen(false)} title="Manage your plan" footer={
        <>
          <Button variant="ghost" onClick={() => setManageOpen(false)}>Cancel</Button>
          <Button onClick={() => { setManageOpen(false); toast("Demo only", { desc: "Billing is disabled in this showcase — no cards are charged.", variant: "info" }); }}>
            Confirm (demo)
          </Button>
        </>
      }>
        <div className="space-y-4">
          <div className="rounded-xl border border-edge bg-surface-2/50 p-4">
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-semibold text-ink">Nexa Pro — Monthly</p>
              <p className="font-display text-lg font-bold text-ink">$20<span className="text-[11px] font-normal text-ink-3">/mo</span></p>
            </div>
            <p className="mt-1.5 text-[12px] leading-relaxed text-ink-3">
              2,600 requests and 2M tokens each cycle, all models, priority queue.
            </p>
          </div>
          <ul className="space-y-1.5 text-[12.5px] text-ink-2">
            <li>· Request allowance now {reqPct}% used</li>
            <li>· Token allowance now {tokPct}% used</li>
            <li>· Cycle resets automatically on {planUsage.endDate}</li>
            <li>· No cards, no charges — this is a frontend showcase</li>
          </ul>
        </div>
      </Modal>
    </div>
  );
}

function CCircle({ pct, accent, label, sub, icon }: { pct: number; accent: string; label: string; sub: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <RingChart percent={pct} size={72} accent={accent} />
      <div className="min-w-0">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-3">
          {icon}
          {sub}
        </p>
        <p className="mt-1 truncate font-display text-[15px] font-bold text-ink">{label}</p>
        <p className="text-[11px] text-ink-3">{pct}% used in this cycle</p>
      </div>
    </div>
  );
}