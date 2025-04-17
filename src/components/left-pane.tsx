import React from "react";
import MonthlyIncomeCard from "./monthly-income-card";
import CategoryCard from "./category-card";
import { ShinyRotatingBorderButton } from "./shiny-button";
import type { Category } from "../data/defaultCategories";

interface LeftPaneProps {
  income: string;
  setIncome: (val: string) => void;
  format: (val: string | number) => string;
  parseCurrency: (val: string) => number;
  categories: Category[];
  handleSubcategoryChange: (
    catIndex: number,
    subIndex: number,
    value: string,
  ) => void;
  handleSubcategoryLabelChange: (
    catIndex: number,
    subIndex: number,
    label: string,
  ) => void;
  addSubcategory: (catIndex: number) => void;
  deleteSubcategory: (catIndex: number, subIndex: number) => void;
  deleteCategory: (catIndex: number) => void;
  setShowAddCategoryModal: (open: boolean) => void;
}

const LeftPane: React.FC<LeftPaneProps> = ({
  income,
  setIncome,
  format,
  parseCurrency,
  categories,
  handleSubcategoryChange,
  handleSubcategoryLabelChange,
  addSubcategory,
  deleteSubcategory,
  deleteCategory,
  setShowAddCategoryModal,
}) => {
  return (
    <div className="w-full lg:w-1/2 flex flex-col gap-4">
      <MonthlyIncomeCard
        income={income}
        setIncome={setIncome}
        format={format}
        parseCurrency={parseCurrency}
      />

      {categories.map((cat, index) => (
        <CategoryCard
          key={index}
          category={cat}
          index={index}
          onSubcategoryChange={handleSubcategoryChange}
          onLabelChange={handleSubcategoryLabelChange}
          onAddSubcategory={addSubcategory}
          onDeleteSubcategory={deleteSubcategory}
          onDeleteCategory={deleteCategory}
        />
      ))}

      <ShinyRotatingBorderButton onClick={() => setShowAddCategoryModal(true)}>
        + Add New Category
      </ShinyRotatingBorderButton>
    </div>
  );
};

export default LeftPane;
