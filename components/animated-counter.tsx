"use client";

import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";

export function AnimatedCounter({ value, prefix = "", suffix = "", compact = false }: {
  value: number;
  prefix?: string;
  suffix?: string;
  compact?: boolean;
}) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    const number = Math.round(latest);
    return compact && number >= 1000 ? `${Math.round(number / 1000)}k` : number.toLocaleString();
  });

  useEffect(() => {
    const controls = animate(count, value, { duration: 1.8, ease: "easeOut" });
    return controls.stop;
  }, [count, value]);

  return (
    <span>
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}
