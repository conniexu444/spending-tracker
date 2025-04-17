"use client";

import type { ReactNode } from "react";
import { cn } from "../utils/cn";
import { useMouse } from "../cuicui/hooks/use-mouse";

interface CompactCardProps {
  header: ReactNode;
  children?: ReactNode;
  className?: string;
  circleSize?: number;
}

export const MainMenusCompactCard = ({
  header,
  children,
  className,
  circleSize = 400,
}: CompactCardProps) => {
  const [mouse, parentRef] = useMouse();

  return (
    <div
      ref={parentRef}
      className={cn(
        "group relative transform-gpu overflow-hidden rounded-[20px] bg-white/10 p-3 transition-transform hover:scale-[1.01]",
        className,
      )}
    >
      {/* Gradient hover shimmer */}
      <div
        className={cn(
          "-translate-x-1/2 -translate-y-1/2 absolute transform-gpu rounded-full transition-transform duration-500 group-hover:scale-[3]",
          mouse.elementX === null || mouse.elementY === null
            ? "opacity-0"
            : "opacity-100",
        )}
        style={{
          maskImage: `radial-gradient(${circleSize / 2}px circle at center, white, transparent)`,
          width: `${circleSize}px`,
          height: `${circleSize}px`,
          left: `${mouse.elementX}px`,
          top: `${mouse.elementY}px`,
          background:
            "linear-gradient(135deg, #3BC4F2, #7A69F9,#F26378,#F5833F)",
        }}
      />
      {/* Background layer */}
      <div className="absolute inset-px rounded-[19px] bg-neutral-100/80 dark:bg-neutral-900/80" />

      {/* Header */}
      <div className="relative z-10">{header}</div>

      {/* Optional children */}
      {children && <div className="relative z-10 mt-2">{children}</div>}
    </div>
  );
};
