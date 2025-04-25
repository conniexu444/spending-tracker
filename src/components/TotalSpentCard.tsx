"use client";

import { Pie } from "react-chartjs-2";
import { useTheme } from "../hooks/useTheme";
import { MainMenusCompactCard } from "../components/gradient-card-compact";

interface TotalSpentCardProps {
  categoryLabels: string[];
  categoryTotals: number[];
  format: (val: string | number) => string;
}

const TotalSpentCard: React.FC<TotalSpentCardProps> = ({
  categoryLabels,
  categoryTotals,
  format,
}) => {
  const { theme } = useTheme();

  return (
    <MainMenusCompactCard
      className="w-full"
      header={
        <div className="flex justify-between items-center px-2 py-1">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Total Spent
          </span>
          <span className="text-base font-semibold text-gray-900 dark:text-white">
            {format(categoryTotals.reduce((a, b) => a + b, 0))}
          </span>
        </div>
      }
    >
      <Pie
        data={{
          labels: categoryLabels,
          datasets: [
            {
              label: "Amount Spent",
              data: categoryTotals,
              backgroundColor: [
                "#3BC4F2",
                "#7A69F9",
                "#F26378",
                "#F5833F",
                "#4ADE80",
                "#A78BFA",
                "#FB923C",
                "#F472B6",
                "#818CF8",
                "#FCD34D",
              ],
              borderColor: "#000000",
              borderWidth: 1,
            },
          ],
        }}
        options={{
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

export default TotalSpentCard;
