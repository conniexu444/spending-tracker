import React from "react";
import { ModernSimpleInput } from "./ModernSimpleInput";
import { MainMenusCompactCard } from "./gradient-card-compact";

interface MonthlyIncomeCardProps {
  income: string;
  setIncome: (val: string) => void;
  format: (val: string | number) => string;
  parseCurrency: (val: string) => number;
}

const MonthlyIncomeCard: React.FC<MonthlyIncomeCardProps> = ({
  income,
  setIncome,
  parseCurrency,
}) => {
  return (
    <MainMenusCompactCard
      className="w-full"
      header={
        <div className="flex justify-between items-center px-2 py-1">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Monthly Income
          </span>
          <ModernSimpleInput
            type="text"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            onBlur={(e) => {
              const raw = parseCurrency(e.target.value);
              setIncome(raw.toString());
            }}
            placeholder="$0.00"
            className="w-32 text-right"
          />
        </div>
      }
    />
  );
};

export default MonthlyIncomeCard;
