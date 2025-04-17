"use client";

import React from "react";
import { ModernSimpleInput } from "./ModernSimpleInput";
import { MainMenusGradientCard } from "./gradient-card";

interface MonthlyIncomeCardProps {
  income: string;
  setIncome: (val: string) => void;
  format: (val: string | number) => string;
  parseCurrency: (val: string) => number;
}

const MonthlyIncomeCard: React.FC<MonthlyIncomeCardProps> = ({
  income,
  setIncome,
  format,
  parseCurrency,
}) => {
  return (
    <MainMenusGradientCard
      title="Monthly Income"
      className="w-full"
      withArrow={false}
    >
      <div className="flex flex-col gap-2 p-4">
        <label className="block font-medium text-sm text-neutral-700 dark:text-neutral-200">
          Monthly Total Income
        </label>
        <ModernSimpleInput
          type="text"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
          onBlur={(e) => {
            const raw = parseCurrency(e.target.value);
            setIncome(raw.toString());
          }}
          placeholder="$0.00"
          className="max-w-xs"
        />
      </div>
    </MainMenusGradientCard>
  );
};

export default MonthlyIncomeCard;
