import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function ButtonLink({ href, children, variant = "primary" }: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition",
        variant === "primary"
          ? "bg-champagne text-ink shadow-glow hover:scale-[1.02] hover:bg-copper"
          : "border border-champagne/20 text-champagne hover:border-champagne/45 hover:bg-champagne/10"
      )}
    >
      {children}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}
