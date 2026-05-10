"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";
import { defaultAudit, runAudit, Stage, ToolId, tools, ToolSpend, Workflow } from "@/lib/audit-engine";
import { cn } from "@/lib/utils";

const workflows: Workflow[] = ["Coding", "Support", "Marketing", "Research", "Product"];
const stages: Stage[] = ["Pre-seed", "Seed", "Series A", "Series B+"];
const loadingLines = ["Analyzing AI stack...", "Comparing pricing models...", "Evaluating optimization opportunities...", "Building executive summary..."];

export default function AuditPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState(defaultAudit.profile);
  const [selected, setSelected] = useState<ToolId[]>(defaultAudit.stack.map((item) => item.tool));
  const [spend, setSpend] = useState<ToolSpend[]>(defaultAudit.stack);
  const [progress, setProgress] = useState(16);
  const result = useMemo(() => runAudit({ profile, stack: spend.filter((item) => selected.includes(item.tool)) }), [profile, selected, spend]);

  useEffect(() => {
    if (step !== 3) return;
    setProgress(8);
    const interval = window.setInterval(() => setProgress((value) => Math.min(100, value + 14)), 360);
    const timeout = window.setTimeout(() => {
      window.localStorage.setItem("stackspend:lastAudit", JSON.stringify({ profile, stack: spend.filter((item) => selected.includes(item.tool)), result }));
      router.push("/report/a7sj2ks");
    }, 3200);
    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, [step, router, profile, selected, spend, result]);

  const steps = ["Team Profile", "Current Stack", "Spend Details", "Generate"];

  return (
    <main className="min-h-screen px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <BrandLogo />
          <div className="hidden gap-2 md:flex">
            {steps.map((label, index) => (
              <div key={label} className={cn("rounded-full px-4 py-2 text-xs font-semibold", index <= step ? "bg-champagne text-ink premium-ring" : "bg-champagne/5 text-stone-400")}>
                {label}
              </div>
            ))}
          </div>
        </div>

        <div className="premium-panel mt-10 overflow-hidden rounded-[2rem] shadow-glow">
          <div className="h-1 bg-champagne/10">
            <motion.div className="h-full animated-gradient" animate={{ width: `${((step + 1) / 4) * 100}%` }} />
          </div>
          <div className="p-6 md:p-10">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <StepShell key="profile" title="Team Profile" kicker="Step 1" subtitle="Give the audit engine enough operating context to benchmark your AI spend.">
                  <div className="grid gap-5 md:grid-cols-2">
                    <NumberField label="Team size" value={profile.teamSize} onChange={(teamSize) => setProfile({ ...profile, teamSize })} />
                    <NumberField label="Engineering team size" value={profile.engineeringSize} onChange={(engineeringSize) => setProfile({ ...profile, engineeringSize })} />
                    <ChoiceGroup label="Startup stage" options={stages} value={profile.stage} onChange={(stage) => setProfile({ ...profile, stage })} />
                    <MultiChoice label="Primary AI workflows" options={workflows} value={profile.workflows} onChange={(next) => setProfile({ ...profile, workflows: next })} />
                  </div>
                </StepShell>
              )}

              {step === 1 && (
                <StepShell key="stack" title="Current AI Stack" kicker="Step 2" subtitle="Select the AI tools your team pays for today.">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {(Object.keys(tools) as ToolId[]).map((id) => {
                      const active = selected.includes(id);
                      const meta = tools[id];
                      return (
                        <button
                          key={id}
                          onClick={() => setSelected((current) => active ? current.filter((item) => item !== id) : [...current, id])}
                          className={cn("group rounded-2xl border p-5 text-left transition", active ? "border-champagne/45 bg-champagne/10 shadow-glow" : "border-champagne/10 bg-champagne/[0.025] hover:border-champagne/25")}
                        >
                          <div className="flex items-center justify-between">
                            <div className="grid h-12 w-12 place-items-center rounded-xl bg-champagne text-sm font-black text-ink premium-ring">{meta.logo}</div>
                            <div className={cn("grid h-7 w-7 place-items-center rounded-full border", active ? "border-emerald bg-emerald text-ink" : "border-champagne/20")}>{active && <Check className="h-4 w-4" />}</div>
                          </div>
                          <h3 className="mt-5 text-xl font-bold">{meta.name}</h3>
                          <p className="mt-2 text-sm text-slate-400">{meta.pricing}</p>
                        </button>
                      );
                    })}
                  </div>
                </StepShell>
              )}

              {step === 2 && (
                <StepShell key="spend" title="Make Your Bill Easy" kicker="Step 3" subtitle="For each tool, answer three simple things: what plan, how many people use it, and about how much you pay every month.">
                  {selected.length === 0 ? (
                    <div className="rounded-2xl border border-champagne/10 bg-champagne/[0.025] p-6">
                      <p className="text-lg font-bold">No tools selected yet.</p>
                      <p className="mt-2 text-sm leading-6 text-slate-400">Go back one step and choose at least one AI tool so StackSpend can build your report.</p>
                    </div>
                  ) : (
                    <div className="grid gap-5 lg:grid-cols-2">
                      {selected.map((id) => (
                        <SpendCard key={id} id={id} value={spend.find((item) => item.tool === id) ?? { tool: id, plan: tools[id].plans[1]?.name ?? tools[id].plans[0].name, seats: 1, monthlySpend: tools[id].plans[1]?.price ?? 0, intensity: "Moderate" }} onChange={(next) => setSpend((current) => {
                          const exists = current.some((item) => item.tool === id);
                          return exists ? current.map((item) => item.tool === id ? next : item) : [...current, next];
                        })} />
                      ))}
                    </div>
                  )}
                </StepShell>
              )}

              {step === 3 && (
                <StepShell key="generate" title="Generating Audit" kicker="Step 4" subtitle="StackSpend is building a finance-grade report from your AI stack.">
                  <div className="rounded-3xl border border-champagne/12 bg-black/25 p-8">
                    <div className="flex items-center gap-4">
                      <div className="grid h-12 w-12 place-items-center rounded-full bg-champagne/15 text-champagne"><Loader2 className="h-6 w-6 animate-spin" /></div>
                      <div>
                        <p className="text-lg font-bold">{loadingLines[Math.min(loadingLines.length - 1, Math.floor(progress / 28))]}</p>
                        <p className="text-sm text-slate-400">No generic checklist. Pricing, seats, duplication, and stage benchmarks are being compared.</p>
                      </div>
                    </div>
                    <div className="mt-8 h-3 overflow-hidden rounded-full bg-champagne/10">
                      <motion.div className="h-full animated-gradient" animate={{ width: `${progress}%` }} />
                    </div>
                  </div>
                </StepShell>
              )}
            </AnimatePresence>

            <div className="mt-10 flex justify-between">
              <button disabled={step === 0 || step === 3} onClick={() => setStep((value) => value - 1)} className="inline-flex h-11 items-center gap-2 rounded-full border border-champagne/15 px-5 text-sm font-semibold text-stone-300 transition hover:border-champagne/35 disabled:opacity-30">
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              {step < 3 && (
                <button onClick={() => setStep((value) => value + 1)} className="inline-flex h-11 items-center gap-2 rounded-full bg-champagne px-5 text-sm font-semibold text-ink shadow-glow transition hover:bg-copper">
                  {step === 2 ? "Review + Generate" : "Continue"} <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function StepShell({ kicker, title, subtitle, children }: { kicker: string; title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <motion.section initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.28 }}>
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-champagne">{kicker}</p>
      <h1 className="mt-3 text-4xl font-black">{title}</h1>
      <p className="mt-3 max-w-2xl text-slate-400">{subtitle}</p>
      <div className="mt-8">{children}</div>
    </motion.section>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="rounded-2xl border border-champagne/10 bg-champagne/[0.025] p-5">
      <span className="text-sm font-semibold text-slate-300">{label}</span>
      <input type="number" min={1} value={value} onChange={(event) => onChange(Number(event.target.value))} className="mt-4 w-full bg-transparent text-4xl font-black outline-none" />
    </label>
  );
}

function ChoiceGroup<T extends string>({ label, options, value, onChange }: { label: string; options: T[]; value: T; onChange: (value: T) => void }) {
  return (
    <div className="rounded-2xl border border-champagne/10 bg-champagne/[0.025] p-5">
      <p className="text-sm font-semibold text-slate-300">{label}</p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {options.map((option) => (
          <button key={option} onClick={() => onChange(option)} className={cn("rounded-xl px-3 py-3 text-sm font-semibold", value === option ? "bg-champagne text-ink" : "bg-champagne/5 text-stone-300")}>{option}</button>
        ))}
      </div>
    </div>
  );
}

function MultiChoice<T extends string>({ label, options, value, onChange }: { label: string; options: T[]; value: T[]; onChange: (value: T[]) => void }) {
  return (
    <div className="rounded-2xl border border-champagne/10 bg-champagne/[0.025] p-5">
      <p className="text-sm font-semibold text-slate-300">{label}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {options.map((option) => {
          const active = value.includes(option);
          return (
            <button key={option} onClick={() => onChange(active ? value.filter((item) => item !== option) : [...value, option])} className={cn("rounded-full px-4 py-2 text-sm font-semibold", active ? "bg-emerald text-ink" : "bg-champagne/5 text-stone-300")}>{option}</button>
          );
        })}
      </div>
    </div>
  );
}

function SpendCard({ id, value, onChange }: { id: ToolId; value: ToolSpend; onChange: (value: ToolSpend) => void }) {
  const meta = tools[id];
  const selectedPlan = meta.plans.find((item) => item.name === value.plan) ?? meta.plans[0];
  const usageOptions: { value: ToolSpend["intensity"]; label: string; helper: string }[] = [
    { value: "Light", label: "Rarely", helper: "A few times a month" },
    { value: "Moderate", label: "Sometimes", helper: "Every week" },
    { value: "Heavy", label: "Every day", helper: "Part of daily work" }
  ];

  const updateSeats = (seats: number) => {
    const safeSeats = Math.max(1, seats);
    onChange({
      ...value,
      seats: safeSeats,
      monthlySpend: selectedPlan.price > 0 ? selectedPlan.price * safeSeats : value.monthlySpend
    });
  };

  return (
    <div className="rounded-2xl border border-champagne/10 bg-champagne/[0.025] p-5">
      <div className="flex items-start gap-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-champagne text-sm font-black text-ink premium-ring">{meta.logo}</div>
        <div>
          <p className="text-xl font-black">{meta.name}</p>
          <p className="mt-1 text-sm leading-6 text-slate-400">Tell us what your bill roughly looks like. Best guess is fine.</p>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        <div>
          <p className="text-sm font-semibold text-slate-300">Which plan are you on?</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {meta.plans.map((plan) => (
              <button
                key={plan.name}
                onClick={() => onChange({ ...value, plan: plan.name, monthlySpend: plan.price > 0 ? plan.price * value.seats : value.monthlySpend })}
                className={cn("rounded-xl border px-4 py-3 text-left transition", value.plan === plan.name ? "border-champagne/45 bg-champagne/15" : "border-champagne/10 bg-black/20 hover:border-champagne/25")}
              >
                <span className="block text-sm font-bold">{plan.name}</span>
                <span className="mt-1 block text-xs text-slate-400">{plan.price > 0 ? `$${plan.price} per person / mo` : meta.category === "API" ? "type your monthly API spend below" : "free plan"}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-champagne/10 bg-black/20 p-4">
            <p className="text-sm font-semibold text-slate-300">How many people use it?</p>
            <div className="mt-3 flex h-12 items-center justify-between rounded-full border border-champagne/10 bg-black/25 px-2">
              <button onClick={() => updateSeats(value.seats - 1)} className="grid h-8 w-8 place-items-center rounded-full bg-champagne/10 text-lg font-black text-champagne">-</button>
              <input aria-label={`${meta.name} people count`} type="number" min={1} value={value.seats} onChange={(event) => updateSeats(Number(event.target.value))} className="w-20 bg-transparent text-center text-2xl font-black outline-none" />
              <button onClick={() => updateSeats(value.seats + 1)} className="grid h-8 w-8 place-items-center rounded-full bg-champagne text-lg font-black text-ink">+</button>
            </div>
            <p className="mt-2 text-xs text-slate-500">People with paid access.</p>
          </div>

          <label className="rounded-xl border border-champagne/10 bg-black/20 p-4">
            <span className="text-sm font-semibold text-slate-300">About how much per month?</span>
            <div className="mt-3 flex h-12 items-center rounded-full border border-champagne/10 bg-black/25 px-4">
              <span className="text-lg font-black text-champagne">$</span>
              <input aria-label={`${meta.name} monthly bill`} type="number" min={0} value={value.monthlySpend} onChange={(event) => onChange({ ...value, monthlySpend: Number(event.target.value) })} className="ml-2 w-full bg-transparent text-2xl font-black outline-none" />
            </div>
            <span className="mt-2 block text-xs text-slate-500">Auto-filled from the plan, but you can change it.</span>
          </label>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-300">How often does your team use it?</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {usageOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onChange({ ...value, intensity: option.value })}
                className={cn("rounded-xl border px-3 py-3 text-left transition", value.intensity === option.value ? "border-emerald/45 bg-emerald/15" : "border-champagne/10 bg-black/20 hover:border-champagne/25")}
              >
                <span className="block text-sm font-bold">{option.label}</span>
                <span className="mt-1 block text-xs text-slate-400">{option.helper}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
