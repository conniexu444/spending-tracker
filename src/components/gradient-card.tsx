"use client";
import { ArrowUpRightIcon, X } from "lucide-react";
import type { ReactNode } from "react";
import { useMouse } from "../cuicui/hooks/use-mouse";
import { cn } from "../utils/cn";
import { BeforeEffectButton } from "./BeforeEffectButton";

export const MainMenusGradientCard = ({
  title,
  description,
  withArrow = false,
  circleSize = 400,
  className,
  children,
  onDeleteCategory,
}: {
  title: string;
  description?: string;
  withArrow?: boolean;
  circleSize?: number;
  children?: ReactNode;
  className?: string;
  onDeleteCategory?: () => void;
  size?: "sm" | "md" | "lg";
}) => {
  const [mouse, parentRef] = useMouse();

  return (
    <div
      className="group relative transform-gpu overflow-hidden rounded-[20px] bg-white/10 p-2 transition-transform hover:scale-[1.01]"
      ref={parentRef}
    >
      {withArrow && (
        <ArrowUpRightIcon className="absolute top-2 right-2 z-10 size-5 translate-y-4 text-neutral-700 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100 dark:text-neutral-300 " />
      )}
      <div
        className={cn(
          "-translate-x-1/2 -translate-y-1/2 absolute transform-gpu rounded-full transition-transform duration-500 group-hover:scale-[3]",
          mouse.elementX === null || mouse.elementY === null
            ? "opacity-0"
            : "opacity-100",
        )}
        style={{
          maskImage: `radial-gradient(${
            circleSize / 2
          }px circle at center, white, transparent)`,
          width: `${circleSize}px`,
          height: `${circleSize}px`,
          left: `${mouse.elementX}px`,
          top: `${mouse.elementY}px`,
          background:
            "linear-gradient(135deg, #3BC4F2, #7A69F9,#F26378,#F5833F)",
        }}
      />
      <div className="relative px-4 pt-4 pb-2">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
            {title}
          </h3>
          {withArrow && (
            <ArrowUpRightIcon className="size-5 text-neutral-700 dark:text-neutral-300" />
          )}
        </div>

        {description && (
          <p className="mt-2 text-neutral-800 dark:text-neutral-300">
            {description}
          </p>
        )}
      </div>
      <div className="absolute inset-px rounded-[19px] bg-neutral-100/80 dark:bg-neutral-900/80" />
      {onDeleteCategory && (
        <BeforeEffectButton
          onClick={onDeleteCategory}
          className="absolute top-3 right-3 text-gray-600 dark:text-white hover:text-red-600"
        >
          <X size={14} />
        </BeforeEffectButton>
      )}
      {children && (
        <div
          className={cn(
            "relative p-4 rounded-[15px] border-white dark:border-neutral-950 dark:bg-transparent",
            className,
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
};
