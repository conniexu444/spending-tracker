"use client";

import { cn } from "../utils/cn";
import { motion, type Transition } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";

type BorderTrailProps = {
  className?: string;
  size?: number;
  transition?: Transition;
  delay?: number;
  onAnimationComplete?: () => void;
  style?: CSSProperties;
  children?: ReactNode;
};

export function BorderTrail({
  className,
  size = 80,
  transition,
  delay,
  onAnimationComplete,
  style,
  children,
}: BorderTrailProps) {
  const BASE_TRANSITION = {
    repeat: Number.POSITIVE_INFINITY,
    duration: 60,
    ease: "linear",
  };

  return (
    <div className={cn("relative z-0 rounded-xl", className)} style={style}>
      {/* White animated border trail */}
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]">
        <motion.div
          className="absolute aspect-square bg-white opacity-30 blur-sm"
          style={{
            width: size,
            offsetPath: `rect(0 auto auto 0 round ${size}px)`,
          }}
          animate={{
            offsetDistance: ["0%", "100%"],
          }}
          transition={{
            ...(transition ?? BASE_TRANSITION),
            delay: delay,
          }}
          onAnimationComplete={onAnimationComplete}
        />
      </div>

      {/* Wrapped content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
