"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowRight, BadgeDollarSign, CheckCircle2, ExternalLink, Gauge, LockKeyhole, Share2, Sparkles, TrendingDown } from "lucide-react";
import { AnimatedCounter } from "@/components/animated-counter";
import { BrandLogo } from "@/components/brand-logo";
import { AuditInput, defaultAudit, Recommendation, runAudit, ToolId, tools } from "@/lib/audit-engine";
import { cn, money } from "@/lib/utils";

const planLinks: Record<ToolId, string> = {
  cursor: "https://cursor.com/pricing",
  chatgpt: "https://openai.com/chatgpt/pricing/",
  claude: "https://www.anthropic.com/pricing",
  gemini: "https://gemini.google.com/advanced",
  copilot: "https://github.com/features/copilot/plans",
  windsurf: "https://windsurf.com/pricing",
  openai_api: "https://openai.com/api/pricing/"
};

export default function ReportPage() {
  const [audit, setAudit] = useState<AuditInput>(defaultAudit);

  useEffect(() => {
    const saved = window.localStorage.getItem("stackspend:lastAudit");
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as { profile: AuditInput["profile"]; stack: AuditInput["stack"] };
      setAudit({ profile: parsed.profile, stack: parsed.stack });
    } catch {
      setAudit(defaultAudit);
    }
  }, []);

  const result = useMemo(() => runAudit(audit), [audit]);
  const lowSavings = result.monthlySavings < 75;

  const chartData = [
    { name: "Your team", spend: result.benchmark.spendPerDeveloper },
    { name: "Peer median", spend: result.benchmark.peerSpendPerDeveloper },
    { name: "Optimized", spend: Math.max(28, result.benchmark.spendPerDeveloper - Math.round(result.monthlySavings / Math.max(1, audit.profile.engineeringSize))) }
  ];

  const categoryData = [
    { category: "Coding AI", you: categorySpend(audit, "Coding"), peers: audit.profile.engineeringSize * 44 },
    { category: "Chat AI", you: categorySpend(audit, "Chat"), peers: audit.profile.teamSize * 22 },
    { category: "APIs", you: 180, peers: 150 }
  ];

  return (
    <main className="min-h-screen px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <nav className="flex items-center justify-between">
          <BrandLogo />
          <div className="flex items-center gap-3 text-sm text-stone-400">
            <LockKeyhole className="h-4 w-4 text-champagne" />
            Public report hides email and company name
          </div>
        </nav>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="glass rounded-[2rem] p-8 md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-champagne">AI Spend Audit</p>
            <h1 className="mt-5 text-5xl font-black leading-none md:text-7xl">
              Potential Savings: <span className="text-champagne">$<AnimatedCounter value={result.annualSavings} /></span>/year
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              {lowSavings ? "Your AI stack is already highly optimized." : "Your team is overpaying mainly through underutilized collaborative plans."}
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <Metric label="Monthly savings" value={money(result.monthlySavings)} />
              <Metric label="Annual savings" value={money(result.annualSavings)} />
              <Metric label="Efficiency score" value={`${result.score}/100`} />
            </div>
          </div>

          <div className="premium-panel rounded-[2rem] p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">AI Spend Score</p>
                <div className="mt-2 text-6xl font-black">{result.score}<span className="text-2xl text-slate-500">/100</span></div>
              </div>
              <Gauge className="h-14 w-14 text-champagne" />
            </div>
            <div className="mt-8 h-4 overflow-hidden rounded-full bg-champagne/10">
              <motion.div initial={{ width: 0 }} animate={{ width: `${result.score}%` }} transition={{ duration: 1.2 }} className={cn("h-full", result.score > 74 ? "bg-emerald" : result.score > 58 ? "bg-champagne" : "bg-ruby")} />
            </div>
            <div className="mt-6 rounded-2xl border border-champagne/10 bg-black/20 p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Status</p>
              <p className="mt-2 text-2xl font-black">{result.status}</p>
            </div>
          </div>
        </section>

        {lowSavings ? (
          <section className="mt-6 rounded-[2rem] border border-emerald/25 bg-emerald/10 p-8 shadow-emerald">
            <CheckCircle2 className="h-8 w-8 text-emerald" />
            <h2 className="mt-5 text-3xl font-black">No forced savings story here.</h2>
            <p className="mt-3 max-w-2xl text-slate-300">Your AI stack is already highly optimized. Want alerts when better pricing opportunities appear?</p>
            <button className="mt-6 rounded-full bg-champagne px-5 py-3 text-sm font-bold text-ink shadow-glow transition hover:bg-copper">Get Pricing Alerts</button>
          </section>
        ) : (
          <section className="mt-6">
            <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-champagne">Recommended plan moves</p>
                <h2 className="mt-2 text-3xl font-black">Start with these low-friction savings.</h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-slate-400">Each card shows what to change, why it helps, and where to check the plan before you switch.</p>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              {result.recommendations.map((rec) => (
                <RecommendationCard key={`${rec.tool}-${rec.currentPlan}`} rec={rec} />
              ))}
            </div>
          </section>
        )}

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <Panel title={`Companies your size spend ${Math.max(0, result.benchmark.variance)}% less on coding AI tools.`} icon={<TrendingDown className="h-6 w-6 text-emerald" />}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData}>
                <CartesianGrid stroke="rgba(244, 220, 164, 0.08)" vertical={false} />
                <XAxis dataKey="name" stroke="#a9a29a" />
                <YAxis stroke="#a9a29a" />
                <Tooltip contentStyle={{ background: "#12100c", border: "1px solid rgba(244, 220, 164, 0.18)", borderRadius: 12 }} />
                <Bar dataKey="spend" fill="#f4dca4" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Panel>

          <Panel title={`Efficiency percentile: ${result.benchmark.percentile}th`} icon={<BadgeDollarSign className="h-6 w-6 text-champagne" />}>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={categoryData}>
                <defs>
                  <linearGradient id="you" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#67d5c0" stopOpacity={0.75} />
                    <stop offset="95%" stopColor="#67d5c0" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="category" stroke="#a9a29a" />
                <YAxis stroke="#a9a29a" />
                <Tooltip contentStyle={{ background: "#12100c", border: "1px solid rgba(244, 220, 164, 0.18)", borderRadius: 12 }} />
                <Area type="monotone" dataKey="you" stroke="#67d5c0" fill="url(#you)" strokeWidth={3} />
                <Area type="monotone" dataKey="peers" stroke="#f4dca4" fill="transparent" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </Panel>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Panel title="Optimization Timeline" icon={<Sparkles className="h-6 w-6 text-champagne" />}>
            {["Immediate Savings: downgrade unused seats", "Medium-Term: consolidate overlapping AI chat tools", "Long-Term: renegotiate enterprise contracts"].map((item, index) => (
              <div key={item} className="flex gap-4 border-l border-champagne/10 pb-7 pl-5 last:pb-0">
                <div className="-ml-[1.84rem] grid h-9 w-9 place-items-center rounded-full bg-champagne text-sm font-black text-ink premium-ring">{index + 1}</div>
                <p className="pt-2 font-semibold">{item}</p>
              </div>
            ))}
          </Panel>
          <Panel title="Executive CFO Summary" icon={<Share2 className="h-6 w-6 text-emerald" />}>
            <p className="text-lg leading-8 text-slate-300">{result.summary}</p>
          </Panel>
        </section>

        {result.monthlySavings > 500 && (
          <section className="mt-6 rounded-[2rem] border border-champagne/20 bg-champagne/[0.07] p-8 shadow-glow">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-champagne">Credex Integration</p>
            <h2 className="mt-3 text-4xl font-black">Unlock Even More Savings with Credex</h2>
            <p className="mt-4 max-w-2xl leading-7 text-slate-300">Your savings are high enough to justify discounted credits, infrastructure optimization, and enterprise negotiation support.</p>
            <button className="mt-7 inline-flex items-center gap-2 rounded-full bg-champagne px-6 py-3 text-sm font-bold text-ink transition hover:bg-copper">Book Optimization Call <ArrowRight className="h-4 w-4" /></button>
          </section>
        )}
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-champagne/10 bg-champagne/[0.04] p-5">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-black">{value}</p>
    </div>
  );
}

function Panel({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="premium-panel rounded-[2rem] p-6">
      <div className="mb-6 flex items-center justify-between gap-5">
        <h2 className="text-2xl font-black">{title}</h2>
        {icon}
      </div>
      {children}
    </section>
  );
}

function RecommendationCard({ rec }: { rec: Recommendation }) {
  const meta = tools[rec.tool];
  const detail = recommendationDetail(rec);

  return (
    <article className="premium-panel flex min-h-[25rem] flex-col rounded-[1.75rem] p-6 transition hover:-translate-y-1 hover:border-champagne/35 hover:shadow-glow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-champagne text-sm font-black text-ink premium-ring">{meta.logo}</div>
          <div>
            <p className="text-sm text-slate-400">{meta.name}</p>
            <h3 className="text-xl font-black">{rec.recommendedPlan}</h3>
          </div>
        </div>
        <span className="rounded-full bg-emerald/15 px-3 py-1 text-xs font-bold text-emerald">{rec.impact}</span>
      </div>

      <div className="mt-6 rounded-2xl border border-emerald/20 bg-emerald/[0.08] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald">Estimated savings</p>
        <p className="mt-2 text-4xl font-black text-white">{money(rec.monthlySavings)}<span className="text-lg text-slate-400">/mo</span></p>
        <p className="mt-1 text-sm text-slate-400">{money(rec.monthlySavings * 12)} every year if usage stays similar.</p>
      </div>

      <div className="mt-5 grid gap-3 rounded-2xl border border-champagne/10 bg-black/20 p-4">
        <PlanLine label="Current" value={`${rec.currentPlan} · ${money(rec.currentMonthly)}/mo`} muted />
        <PlanLine label="Better fit" value={rec.recommendedPlan} />
      </div>

      <p className="mt-5 leading-7 text-slate-300">{detail.summary}</p>

      <div className="mt-4 space-y-2 text-sm text-slate-400">
        {detail.points.map((point) => (
          <div key={point} className="flex gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald" />
            <span>{point}</span>
          </div>
        ))}
      </div>

      <a
        href={planLinks[rec.tool]}
        target="_blank"
        rel="noreferrer"
        className="mt-auto inline-flex h-11 items-center justify-center gap-2 rounded-full bg-champagne px-5 text-sm font-bold text-ink transition hover:bg-copper"
      >
        View {meta.name} plans <ExternalLink className="h-4 w-4" />
      </a>
    </article>
  );
}

function PlanLine({ label, value, muted = false }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</span>
      <span className={cn("text-right text-sm font-bold", muted ? "text-slate-300" : "text-champagne")}>{value}</span>
    </div>
  );
}

function recommendationDetail(rec: Recommendation) {
  const meta = tools[rec.tool];
  const annual = money(rec.monthlySavings * 12);

  if (meta.category === "Coding") {
    return {
      summary: `${rec.recommendedPlan} keeps the coding workflow covered while trimming paid seats or heavier team features that are not carrying their weight.`,
      points: [
        "Best when only active builders need the tool every week.",
        "Review seats with your engineering lead before removing access.",
        `Expected impact: about ${annual} back into runway.`
      ]
    };
  }

  if (meta.category === "Chat") {
    return {
      summary: `${rec.recommendedPlan} is the better fit because the current chat workspace has more paid access than the team appears to need.`,
      points: [
        "Keep power users on paid seats and move occasional users down.",
        "Avoid paying twice for overlapping chat assistants.",
        `Expected impact: about ${annual} back into runway.`
      ]
    };
  }

  return {
    summary: `${rec.recommendedPlan} should reduce API waste while keeping room for real product usage.`,
    points: [
      "Check dashboard usage before changing committed spend.",
      "Set alerts so experiments do not quietly become permanent bills.",
      `Expected impact: about ${annual} back into runway.`
    ]
  };
}

function categorySpend(audit: AuditInput, category: "Coding" | "Chat" | "API") {
  return audit.stack.filter((item) => tools[item.tool].category === category).reduce((sum, item) => sum + item.monthlySpend, 0);
}
