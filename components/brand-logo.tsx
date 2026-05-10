import Image from "next/image";
import Link from "next/link";

export function BrandLogo() {
  return (
    <Link href="/" className="flex items-center gap-3 transition hover:opacity-90" aria-label="StackSpend home">
      <Image
        src="/stackspend-logo.svg"
        alt="StackSpend"
        width={44}
        height={44}
        className="h-11 w-11 rounded-xl object-cover shadow-glow"
      />
      <span className="text-sm font-semibold tracking-wide text-champagne">StackSpend</span>
    </Link>
  );
}
