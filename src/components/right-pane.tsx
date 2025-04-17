"use client";

import { Pie, Doughnut } from "react-chartjs-2";
import { MainMenusCompactCard } from "./gradient-card-compact";
import { useTheme } from "../hooks/useTheme";
import { Category } from "../data/defaultCategories";

interface RightPaneProps {
  format: (val: string | number) => string;
  totalSpent: number;
  remaining: number;
  incomeAmount: number;
  categories: Category[];
  categoryTotals: number[];
}

const RightPane: React.FC<RightPaneProps> = ({
  format,
  totalSpent,
  remaining,
  incomeAmount,
  categories,
  categoryTotals,
}) => {
  const { theme } = useTheme();

  return (
    <div className="flex flex-col items-center gap-8 w-full lg:w-1/2">
      <div className="w-full flex flex-col sm:flex-row gap-4">
        {/* Total Spent Card + Pie Chart */}
        <div className="flex-1 space-y-2">
          <MainMenusCompactCard
            className="w-full"
            header={
              <div className="flex justify-between items-center px-2 py-1">
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Total Spent
                </span>
                <span className="text-base font-semibold text-gray-900 dark:text-white">
                  {format(totalSpent.toString())}
                </span>
              </div>
            }
          />

          <Pie
            data={{
              labels: categories.map((cat) => cat.title),
              datasets: [
                {
                  label: "Amount Spent",
                  data: categoryTotals,
                  backgroundColor: [
                    "#f87171",
                    "#60a5fa",
                    "#facc15",
                    "#34d399",
                    "#a78bfa",
                    "#fb923c",
                    "#f472b6",
                    "#818cf8",
                    "#4ade80",
                    "#fcd34d",
                  ],
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
        </div>

        {/* Total Left Card + Doughnut Chart */}
        <div className="flex-1 space-y-2">
          <MainMenusCompactCard
            className="w-full"
            header={
              <div className="flex justify-between items-center px-2 py-1">
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Total Left
                </span>
                <span className="text-base font-semibold text-gray-900 dark:text-white">
                  {format(remaining.toString())}
                </span>
              </div>
            }
          />

          <Doughnut
            data={{
              labels: ["Spent", "Remaining"],
              datasets: [
                {
                  label: "Budget",
                  data: [totalSpent, Math.max(0, incomeAmount - totalSpent)],
                  backgroundColor: ["#f87171", "#4ade80"],
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
        </div>
      </div>
    </div>
  );
};

export default RightPane;
