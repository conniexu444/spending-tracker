"use client";

import React, { useState } from "react";
import { Category } from "../data/defaultCategories";
import { X } from "lucide-react";
import { MainMenusGradientCard } from "./gradient-card";
import { ModernSimpleInput } from "./ModernSimpleInput";
import { BeforeEffectButton } from "./BeforeEffectButton";
import { ShinyRotatingBorderButton } from "./shiny-button";

interface CategoryCardProps {
  category: Category;
  index: number;
  onSubcategoryChange: (
    catIndex: number,
    subIndex: number,
    value: string,
  ) => void;
  onLabelChange: (catIndex: number, subIndex: number, label: string) => void;
  onAddSubcategory: (catIndex: number) => void;
  onDeleteSubcategory: (catIndex: number, subIndex: number) => void;
  onDeleteCategory: (catIndex: number) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  index,
  onSubcategoryChange,
  onLabelChange,
  onAddSubcategory,
  onDeleteSubcategory,
  onDeleteCategory,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <>
      <MainMenusGradientCard
        title={category.title}
        className="h-auto"
        onDeleteCategory={() => setShowDeleteConfirm(true)}
      >
        <div className="space-y-3">
          {category.subcategories.map((sub, subIndex) => (
            <div key={subIndex} className="flex gap-2 items-center">
              <ModernSimpleInput
                type="text"
                value={sub.label}
                onChange={(e) => onLabelChange(index, subIndex, e.target.value)}
                placeholder="Label"
                className="w-1/2"
              />
              <ModernSimpleInput
                type="number"
                value={sub.value}
                onChange={(e) =>
                  onSubcategoryChange(index, subIndex, e.target.value)
                }
                placeholder="$0.00"
                className="w-1/3 no-spinner"
              />
              <BeforeEffectButton
                onClick={() => onDeleteSubcategory(index, subIndex)}
                className="text-gray-600 dark:text-neutral-400 hover:text-red-600"
              >
                <X size={14} />
              </BeforeEffectButton>
            </div>
          ))}
          <ShinyRotatingBorderButton onClick={() => onAddSubcategory(index)}>
            + Add Subcategory
          </ShinyRotatingBorderButton>
        </div>
      </MainMenusGradientCard>

      {/* Confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">
              Confirm Deletion
            </h3>
            <p className="mb-6 text-sm text-gray-700 dark:text-gray-300">
              Are you sure you want to delete{" "}
              <span className="font-semibold">"{category.title}"</span>? This
              will remove all subcategories as well.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="text-sm px-4 py-2 rounded-md border dark:border-neutral-600 dark:text-neutral-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteCategory(index);
                  setShowDeleteConfirm(false);
                }}
                className="text-sm px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CategoryCard;
