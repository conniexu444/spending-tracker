import React from "react";
import MonthlyIncomeCard from "../monthly-income-card";
import CategoryCard from "../category-card";
import { ShinyRotatingBorderButton } from "../ui/ShinyButton";
import type { Category } from "../../data/defaultCategories";

interface LeftPaneProps {
  income: string;
  setIncome: (val: string) => void;
  format: (val: string | number) => string;
  parseCurrency: (val: string) => number;
  categories: Category[];
  handleSubcategoryChange: (categoryId: string, subcategoryId: string, value: string) => void;
  handleSubcategoryLabelChange: (categoryId: string, subcategoryId: string, label: string) => void;
  addSubcategory: (categoryId: string) => void;
  deleteSubcategory: (categoryId: string, subcategoryId: string) => void;
  deleteCategory: (categoryId: string) => void;
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
  // Wrapper functions to convert from index-based calls to ID-based calls
  const handleSubcategoryChangeWrapper = (catIndex: number, subIndex: number, value: string) => {
    const category = categories[catIndex];
    const subcategory = category?.subcategories[subIndex];
    if (category && subcategory) {
      handleSubcategoryChange(category.id, subcategory.id, value);
    }
  };

  const handleSubcategoryLabelChangeWrapper = (catIndex: number, subIndex: number, label: string) => {
    const category = categories[catIndex];
    const subcategory = category?.subcategories[subIndex];
    if (category && subcategory) {
      handleSubcategoryLabelChange(category.id, subcategory.id, label);
    }
  };

  const addSubcategoryWrapper = (catIndex: number) => {
    const category = categories[catIndex];
    if (category) {
      addSubcategory(category.id);
    }
  };

  const deleteSubcategoryWrapper = (catIndex: number, subIndex: number) => {
    const category = categories[catIndex];
    const subcategory = category?.subcategories[subIndex];
    if (category && subcategory) {
      deleteSubcategory(category.id, subcategory.id);
    }
  };

  const deleteCategoryWrapper = (catIndex: number) => {
    const category = categories[catIndex];
    if (category) {
      deleteCategory(category.id);
    }
  };

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
          key={cat.id}
          category={cat}
          index={index}
          onSubcategoryChange={handleSubcategoryChangeWrapper}
          onLabelChange={handleSubcategoryLabelChangeWrapper}
          onAddSubcategory={addSubcategoryWrapper}
          onDeleteSubcategory={deleteSubcategoryWrapper}
          onDeleteCategory={deleteCategoryWrapper}
        />
      ))}

      <ShinyRotatingBorderButton onClick={() => setShowAddCategoryModal(true)}>
        + Add New Category
      </ShinyRotatingBorderButton>
    </div>
  );
};

export default LeftPane;
