"use client";

import { motion } from "framer-motion";
import { BarChart3, BrainCircuit, CheckCircle2, ChevronRight, LineChart, ShieldCheck, Sparkles, Users, WalletCards, type LucideIcon } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";
import { AnimatedCounter } from "@/components/animated-counter";
import { BrandLogo } from "@/components/brand-logo";
import { ButtonLink } from "@/components/button";

const benchmarkData = [
  { month: "Jan", spend: 910 },
  { month: "Feb", spend: 1060 },
  { month: "Mar", spend: 1180 },
  { month: "Apr", spend: 1351 },
  { month: "After", spend: 649 }
];

const features: { title: string; body: string; Icon: LucideIcon }[] = [
  { title: "Cost Leak Detection", body: "Find duplicate seats, abandoned plans, and hidden usage drift.", Icon: WalletCards },
  { title: "Plan Optimization", body: "Recommend downgrades without breaking core AI workflows.", Icon: ShieldCheck },
  { title: "Team Seat Analysis", body: "Match paid seats to actual team composition.", Icon: Users },
  { title: "AI Usage Benchmarking", body: "Compare spend per developer against peer companies.", Icon: BarChart3 },
  { title: "Shareable Reports", body: "Create public reports that hide private company details.", Icon: LineChart },
  { title: "Personalized AI Insights", body: "Executive-ready summaries for operators and founders.", Icon: BrainCircuit }
];

export default function Home() {
  return (
    <main className="overflow-hidden">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <BrandLogo />
        <ButtonLink href="/audit" variant="ghost">Run Free Audit</ButtonLink>
      </nav>

      <section className="relative mx-auto grid min-h-[calc(100vh-84px)] max-w-7xl grid-cols-1 items-center gap-12 px-6 pb-16 pt-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="metric-grid absolute inset-x-0 top-16 h-[34rem] opacity-50" />
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="relative z-10">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-champagne/25 bg-champagne/10 px-4 py-2 text-sm text-champagne">
            <Sparkles className="h-4 w-4" />
            Product Hunt launch-ready AI spend intelligence
          </div>
          <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-normal text-white md:text-7xl">
            Your AI Stack Is Bleeding Money
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Analyze your AI subscriptions, benchmark your spending, and uncover hidden savings in under 2 minutes.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <ButtonLink href="/audit">Run Free Audit</ButtonLink>
            <a href="#how" className="inline-flex items-center gap-2 text-sm font-medium text-stone-300 hover:text-champagne">
              See how it works <ChevronRight className="h-4 w-4" />
            </a>
          </div>
          <div className="mt-10 grid max-w-xl grid-cols-2 gap-4 sm:grid-cols-3">
            <Proof value={42} label="audits this week" />
            <Proof value={184000} prefix="$" compact label="identified savings" />
            <Proof value={12000} prefix="$" compact suffix="+" label="avg team savings" />
          </div>
        </motion.div>

        <DashboardPreview />
      </section>

      <section id="how" className="border-y border-champagne/10 bg-champagne/[0.035] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-champagne">How it works</p>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {["Add Your Stack", "Get AI Audit", "Reduce Waste"].map((title, index) => (
              <motion.div whileHover={{ y: -6 }} key={title} className="glass rounded-2xl p-7">
                <div className="mb-8 grid h-11 w-11 place-items-center rounded-full bg-champagne text-sm font-black text-ink premium-ring">{index + 1}</div>
                <h2 className="text-2xl font-bold">{title}</h2>
                <p className="mt-3 leading-7 text-slate-300">
                  {index === 0 && "Select Cursor, Claude, ChatGPT, APIs, Copilot, Gemini, and the rest of your AI stack."}
                  {index === 1 && "Run pricing-aware optimization logic against team size, stage, and workflow intensity."}
                  {index === 2 && "Get downgrade, consolidation, and contract actions ranked by impact."}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue">Features</p>
          <h2 className="mt-4 text-4xl font-black">Financial intelligence for AI-native teams.</h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map(({ title, body, Icon }) => (
            <motion.div whileHover={{ y: -5 }} key={title} className="premium-panel rounded-2xl p-6 transition hover:border-champagne/35 hover:shadow-glow">
              <Icon className="h-6 w-6 text-champagne" />
              <h3 className="mt-5 text-xl font-bold">{title}</h3>
              <p className="mt-3 leading-7 text-slate-400">{body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="px-6 pb-10">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-champagne/15 bg-champagne/[0.06] p-10 shadow-emerald md:p-16">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-copper">Final check</p>
            <h2 className="mt-4 text-4xl font-black md:text-5xl">Most startups don’t realize how much they waste on AI.</h2>
            <div className="mt-8">
              <ButtonLink href="/audit">Audit My Stack</ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Proof({ value, label, prefix = "", suffix = "", compact = false }: {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  compact?: boolean;
}) {
  return (
    <div className="rounded-xl border border-champagne/15 bg-champagne/[0.055] p-4">
      <div className="text-2xl font-black text-champagne"><AnimatedCounter value={value} prefix={prefix} suffix={suffix} compact={compact} /></div>
      <div className="mt-1 text-xs text-stone-400">{label}</div>
    </div>
  );
}

function DashboardPreview() {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.1 }} className="relative z-10 float-up">
      <div className="absolute -inset-6 rounded-[2.5rem] bg-champagne/10 blur-3xl" />
      <div className="glass relative overflow-hidden rounded-[2rem] p-5 shadow-glow">
        <div className="flex items-center justify-between border-b border-champagne/10 pb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Live Audit Preview</p>
            <h2 className="mt-1 text-xl font-bold">AI Spend Command Center</h2>
          </div>
          <div className="rounded-full bg-emerald/15 px-3 py-1 text-xs font-semibold text-emerald">Analyzing</div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-champagne/10 bg-black/20 p-4 md:col-span-2">
            <p className="text-sm text-slate-400">Potential annual savings</p>
            <div className="mt-2 text-4xl font-black text-white">$<AnimatedCounter value={8420} /></div>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={benchmarkData}>
                <defs>
                  <linearGradient id="spend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f4dca4" stopOpacity={0.85} />
                    <stop offset="95%" stopColor="#f4dca4" stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <Tooltip contentStyle={{ background: "#12100c", border: "1px solid rgba(244, 220, 164, 0.18)", borderRadius: 12 }} />
                <Area type="monotone" dataKey="spend" stroke="#f4dca4" fill="url(#spend)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            <Alert title="Optimization alert" body="3 duplicated coding seats found" />
            <Alert title="Plan downgrade" body="Cursor Business -> Pro" />
            <Alert title="Benchmark" body="34% above peers" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Alert({ title, body }: { title: string; body: string }) {
  return (
    <motion.div whileHover={{ x: 4 }} className="rounded-2xl border border-champagne/12 bg-black/25 p-4">
      <CheckCircle2 className="h-5 w-5 text-emerald" />
      <p className="mt-3 text-sm font-semibold">{title}</p>
      <p className="mt-1 text-sm text-slate-400">{body}</p>
    </motion.div>
  );
}
