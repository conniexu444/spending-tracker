import { useState } from "react";
import type { Category } from "../data/defaultCategories";
import { defaultCategories } from "../data/defaultCategories";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>(defaultCategories);

  const handleSubcategoryChange = (
    catIndex: number,
    subIndex: number,
    value: string,
  ) => {
    const updated = [...categories];
    updated[catIndex].subcategories[subIndex].value = value;
    setCategories(updated);
  };

  const handleSubcategoryLabelChange = (
    catIndex: number,
    subIndex: number,
    label: string,
  ) => {
    const updated = [...categories];
    updated[catIndex].subcategories[subIndex].label = label;
    setCategories(updated);
  };

  const addSubcategory = (catIndex: number) => {
    const updated = [...categories];
    updated[catIndex].subcategories.push({ label: "", value: "" });
    setCategories(updated);
  };

  const deleteSubcategory = (catIndex: number, subIndex: number) => {
    const updated = [...categories];
    updated[catIndex].subcategories.splice(subIndex, 1);
    setCategories(updated);
  };

  const deleteCategory = (index: number) => {
    const updated = [...categories];
    updated.splice(index, 1);
    setCategories(updated);
  };

  const addCategory = (title: string) => {
    const newCategory = {
      title: title.trim(),
      subcategories: [],
    };

    setCategories((prev) => [...prev, newCategory]);
  };

  return {
    categories,
    addCategory,
    setCategories,
    handleSubcategoryChange,
    handleSubcategoryLabelChange,
    addSubcategory,
    deleteSubcategory,
    deleteCategory,
  };
}
