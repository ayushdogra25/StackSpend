import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "StackSpend Report | $11,280 AI Waste Found",
  description: "Public AI spend benchmark report with savings, score, tool recommendations, and optimization timeline.",
  openGraph: {
    title: "This startup wastes $11,280/year on AI tools",
    description: "View the public StackSpend AI savings report.",
    url: "https://stackspend.ai/report/a7sj2ks",
    siteName: "StackSpend",
    type: "article",
    images: [
      {
        url: "/report/a7sj2ks/opengraph-image",
        width: 1200,
        height: 630,
        alt: "StackSpend AI savings report preview"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "This startup wastes $11,280/year on AI tools",
    description: "StackSpend found hidden AI subscription waste."
  }
};

export default function ReportLayout({ children }: { children: React.ReactNode }) {
  return children;
}
