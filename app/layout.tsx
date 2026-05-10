import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "StackSpend | AI Spend Intelligence",
  description: "Analyze your AI subscriptions, benchmark spend, and uncover hidden savings in under 2 minutes.",
  openGraph: {
    title: "This startup wastes $11,280/year on AI tools",
    description: "Run a free StackSpend audit and benchmark your AI stack against similar teams.",
    url: "https://stackspend.ai/report/a7sj2ks",
    siteName: "StackSpend",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "This startup wastes $11,280/year on AI tools",
    description: "Benchmark AI subscriptions and uncover hidden savings in under 2 minutes."
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
