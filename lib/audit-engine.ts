export type Stage = "Pre-seed" | "Seed" | "Series A" | "Series B+";
export type Workflow = "Coding" | "Support" | "Marketing" | "Research" | "Product";

export type TeamProfile = {
  teamSize: number;
  engineeringSize: number;
  workflows: Workflow[];
  stage: Stage;
};

export type ToolId = "cursor" | "chatgpt" | "claude" | "gemini" | "copilot" | "windsurf" | "openai_api";

export type ToolSpend = {
  tool: ToolId;
  plan: string;
  seats: number;
  monthlySpend: number;
  intensity: "Light" | "Moderate" | "Heavy";
};

export type AuditInput = {
  profile: TeamProfile;
  stack: ToolSpend[];
};

export type Recommendation = {
  tool: ToolId;
  title: string;
  currentPlan: string;
  currentMonthly: number;
  recommendedPlan: string;
  monthlySavings: number;
  reason: string;
  impact: "High Impact" | "Medium Impact" | "Low Impact";
};

export const tools: Record<ToolId, {
  name: string;
  logo: string;
  category: "Coding" | "Chat" | "API";
  pricing: string;
  plans: { name: string; price: number }[];
}> = {
  cursor: {
    name: "Cursor",
    logo: "Cu",
    category: "Coding",
    pricing: "$20-$40 / seat",
    plans: [{ name: "Hobby", price: 0 }, { name: "Pro", price: 20 }, { name: "Business", price: 40 }]
  },
  chatgpt: {
    name: "ChatGPT",
    logo: "GP",
    category: "Chat",
    pricing: "$20-$30 / seat",
    plans: [{ name: "Free", price: 0 }, { name: "Plus", price: 20 }, { name: "Team", price: 30 }, { name: "Enterprise", price: 60 }]
  },
  claude: {
    name: "Claude",
    logo: "Cl",
    category: "Chat",
    pricing: "$20-$30 / seat",
    plans: [{ name: "Free", price: 0 }, { name: "Pro", price: 20 }, { name: "Team", price: 30 }]
  },
  gemini: {
    name: "Gemini",
    logo: "Ge",
    category: "Chat",
    pricing: "$20 / seat",
    plans: [{ name: "Free", price: 0 }, { name: "Advanced", price: 20 }, { name: "Workspace AI", price: 30 }]
  },
  copilot: {
    name: "GitHub Copilot",
    logo: "Co",
    category: "Coding",
    pricing: "$10-$39 / seat",
    plans: [{ name: "Individual", price: 10 }, { name: "Business", price: 19 }, { name: "Enterprise", price: 39 }]
  },
  windsurf: {
    name: "Windsurf",
    logo: "Wi",
    category: "Coding",
    pricing: "$15-$35 / seat",
    plans: [{ name: "Pro", price: 15 }, { name: "Teams", price: 30 }, { name: "Enterprise", price: 55 }]
  },
  openai_api: {
    name: "OpenAI API",
    logo: "AI",
    category: "API",
    pricing: "usage-based",
    plans: [{ name: "Usage", price: 0 }, { name: "Committed", price: 250 }, { name: "Enterprise", price: 1000 }]
  }
};

const benchmarkByStage: Record<Stage, number> = {
  "Pre-seed": 58,
  Seed: 72,
  "Series A": 86,
  "Series B+": 104
};

export const defaultAudit: AuditInput = {
  profile: {
    teamSize: 18,
    engineeringSize: 9,
    workflows: ["Coding", "Research"],
    stage: "Seed"
  },
  stack: [
    { tool: "cursor", plan: "Business", seats: 10, monthlySpend: 400, intensity: "Moderate" },
    { tool: "chatgpt", plan: "Team", seats: 18, monthlySpend: 540, intensity: "Heavy" },
    { tool: "claude", plan: "Team", seats: 8, monthlySpend: 240, intensity: "Light" },
    { tool: "copilot", plan: "Business", seats: 9, monthlySpend: 171, intensity: "Moderate" }
  ]
};

export function runAudit(input: AuditInput) {
  const monthlySpend = input.stack.reduce((sum, item) => sum + item.monthlySpend, 0);
  const expectedMonthly = Math.max(input.profile.engineeringSize, 1) * benchmarkByStage[input.profile.stage];
  const duplicateChatTools = input.stack.filter((item) => tools[item.tool].category === "Chat").length;
  const duplicateCodingTools = input.stack.filter((item) => tools[item.tool].category === "Coding").length;

  const recommendations: Recommendation[] = input.stack.map((item) => {
    const meta = tools[item.tool];
    const plan = meta.plans.find((candidate) => candidate.name === item.plan) ?? meta.plans[0];
    const expectedSeats = meta.category === "Coding" ? input.profile.engineeringSize : meta.category === "API" ? 1 : Math.ceil(input.profile.teamSize * 0.65);
    const excessSeats = Math.max(0, item.seats - expectedSeats);
    const isLightTeamPlan = item.intensity === "Light" && /Team|Business|Enterprise|Workspace/.test(item.plan);
    const hasDuplication = (meta.category === "Chat" && duplicateChatTools > 1) || (meta.category === "Coding" && duplicateCodingTools > 1);
    const downgradeTarget = meta.plans[Math.max(0, meta.plans.findIndex((candidate) => candidate.name === item.plan) - 1)] ?? plan;
    const seatSavings = excessSeats * plan.price;
    const downgradeSavings = isLightTeamPlan ? Math.max(0, (plan.price - downgradeTarget.price) * Math.min(item.seats, expectedSeats)) : 0;
    const consolidationSavings = hasDuplication && item.intensity !== "Heavy" ? item.monthlySpend * 0.18 : 0;
    const monthlySavings = Math.round(Math.max(seatSavings, downgradeSavings, consolidationSavings));

    return {
      tool: item.tool,
      title: `${meta.name} ${item.plan}`,
      currentPlan: item.plan,
      currentMonthly: item.monthlySpend,
      recommendedPlan: monthlySavings > 0 ? downgradeTarget.name : item.plan,
      monthlySavings,
      reason: reasonFor(meta.category, item, excessSeats, hasDuplication),
      impact: impactFor(monthlySavings)
    };
  }).filter((rec) => rec.monthlySavings > 0);

  const monthlySavings = recommendations.reduce((sum, item) => sum + item.monthlySavings, 0);
  const annualSavings = monthlySavings * 12;
  const overspendRatio = expectedMonthly ? monthlySpend / expectedMonthly : 1;
  const score = Math.max(38, Math.min(96, Math.round(100 - (overspendRatio - 0.8) * 28 - monthlySavings / 28)));
  const status = score >= 86 ? "Excellent" : score >= 74 ? "Optimized" : score >= 58 ? "Moderate Waste" : "Significant Overspend";

  return {
    monthlySpend,
    monthlySavings,
    annualSavings,
    expectedMonthly,
    score,
    status,
    recommendations,
    benchmark: {
      spendPerDeveloper: Math.round(monthlySpend / Math.max(input.profile.engineeringSize, 1)),
      peerSpendPerDeveloper: benchmarkByStage[input.profile.stage],
      variance: Math.round(((monthlySpend - expectedMonthly) / expectedMonthly) * 100),
      percentile: Math.max(12, Math.min(94, score - 6))
    },
    summary: buildSummary(score, monthlySavings, input.profile.engineeringSize, recommendations.length)
  };
}

function reasonFor(category: "Coding" | "Chat" | "API", item: ToolSpend, excessSeats: number, duplicate: boolean) {
  if (excessSeats > 0) {
    return `${excessSeats} paid seats appear above the active ${category.toLowerCase()} user base.`;
  }

  if (item.intensity === "Light") {
    return "Premium collaboration features appear underutilized relative to usage intensity.";
  }

  if (duplicate) {
    return `Your stack has overlapping ${category.toLowerCase()} tools with room for consolidation.`;
  }

  return "Spend is reasonable, but a lower plan can preserve the core workflow.";
}

function impactFor(monthlySavings: number): Recommendation["impact"] {
  return monthlySavings > 160 ? "High Impact" : monthlySavings > 60 ? "Medium Impact" : "Low Impact";
}

function buildSummary(score: number, monthlySavings: number, engineers: number, recommendations: number) {
  if (monthlySavings < 75) {
    return "Your AI stack is already highly optimized. Spend levels are close to peer benchmarks, with no obvious downgrade or consolidation risk worth forcing.";
  }

  return `Your organization demonstrates strong AI adoption, but the current stack is overprovisioned for a ${engineers}-person engineering team. The clearest savings come from ${recommendations} plan and seat adjustments that reduce duplicate collaborative tooling without limiting core AI workflows.`;
}
