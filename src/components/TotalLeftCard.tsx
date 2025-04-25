"use client";

import { Doughnut } from "react-chartjs-2";
import { useTheme } from "../hooks/useTheme";
import { MainMenusCompactCard } from "./gradient-card-compact";
import chroma from "chroma-js";

interface TotalLeftCardProps {
  totalSpent: number;
  incomeAmount: number;
  format: (val: string | number) => string;
}

const TotalLeftCard: React.FC<TotalLeftCardProps> = ({
  totalSpent,
  incomeAmount,
  format,
}) => {
  const { theme } = useTheme();
  const remaining = incomeAmount - totalSpent;

  const baseColors = ["#f87171", "#4ade80"];

  const backgroundColors =
    theme === "dark"
      ? baseColors.map(
          (color) => chroma.mix(color, "#ffffff", 0.3).hex(), // softer fade to white
        )
      : baseColors.map(
          (color) => chroma.mix(color, "#000000", 0.15).hex(), // very light fade to black
        );

  return (
    <MainMenusCompactCard
      className="w-full"
      header={
        <div className="flex justify-between items-center px-2 py-1">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Total Left
          </span>
          <span className="text-base font-semibold text-gray-900 dark:text-white">
            {format(remaining)}
          </span>
        </div>
      }
    >
      <Doughnut
        data={{
          labels: ["Spent", "Remaining"],
          datasets: [
            {
              label: "Budget",
              data: [totalSpent, Math.max(remaining, 0)],
              backgroundColor: backgroundColors, // ✅ really noticeable now
              borderWidth: 1,
              borderColor: "#333333",
            },
          ],
        }}
        options={{
          cutout: "75%",
          plugins: {
            legend: {
              display: true,
              position: "bottom",
              labels: {
                color: theme === "dark" ? "#e5e7eb" : "#374151",
                boxWidth: 12,
                padding: 16,
              },
            },
          },
        }}
      />
    </MainMenusCompactCard>
  );
};

export default TotalLeftCard;
