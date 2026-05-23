# StackSpend MVP

Launch-ready MVP for an AI spend audit product..

## What is built

- Product Hunt-style landing page with animated dashboard preview
- Step-based audit wizard for team profile, AI stack, spend details, and analysis
- Believable audit engine with pricing, seat, duplication, stage benchmark, and usage-intensity logic
- Viral public report at `/report/a7sj2ks`
- Dynamic Open Graph image route for shared reports
- Honest low-savings state when the stack is already optimized
- Credex CTA only when monthly savings are above `$500`

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Backend plan

Supabase tables:

- `audits`: private audit input, computed savings, score, recommendations, report id
- `leads`: email, report id, source, pricing-alert intent
- `public_reports`: sanitized report payload for share URLs

Anthropic can generate the CFO summary after the deterministic audit engine has produced facts. Keep recommendations grounded in computed findings so the LLM never invents savings.

Resend should send:

- audit report link
- pricing alert confirmation
- Credex optimization-call lead notification
# StackSpend
