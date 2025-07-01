"use client";

import { Category } from "../data/defaultCategories";
import TotalSpentCard from "../components/TotalSpentCard";
import TotalLeftCard from "../components/TotalLeftCard";
import SankeyChart from "../components/SankeyChart";

interface RightPaneProps {
  format: (val: string | number) => string;
  totalSpent: number;
  incomeAmount: number;
  categories: Category[];
  categoryTotals: number[];
}

const RightPane: React.FC<RightPaneProps> = ({
  format,
  totalSpent,
  incomeAmount,
  categories,
  categoryTotals,
}) => {
  return (
    <div className="flex flex-col items-center gap-5 w-full lg:w-1/2">
      <div className="w-full flex flex-col sm:flex-row gap-4">
        <div className="flex-1 min-w-0 space-y-2">
          <TotalSpentCard
            categoryLabels={categories.map((cat) => cat.title)}
            categoryTotals={categoryTotals}
            format={format}
          />
        </div>
        <div className="flex-1 min-w-0 space-y-2">
          <TotalLeftCard
            totalSpent={totalSpent}
            incomeAmount={incomeAmount}
            format={format}
          />
        </div>
      </div>
      <div className="w-full">
        <SankeyChart
          data={categories.flatMap((cat) =>
            cat.subcategories.map((sub) => ({
              from: cat.title,
              to: sub.label || "Unnamed",
              flow: parseFloat(sub.value) || 0,
            })),
          )}
        />
      </div>
    </div>
  );
};

export default RightPane;
