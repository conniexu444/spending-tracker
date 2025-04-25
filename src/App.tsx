import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useState } from "react";
import RightPane from "./components/right-pane";
import LeftPane from "./components/left-pane";

import BudgetAppHeaderCard from "./components/BudgetAppHeaderCard";
import { ModernSimpleInput } from "./components/ModernSimpleInput";
import PreviewPillSwitchTheme from "./components/toggle-theme-icon";
import { BeforeEffectButton } from "./components/BeforeEffectButton";
import { useCategories } from "./hooks/useCategories";
import { useCurrency } from "./hooks/useCurrency";
import { useTheme } from "./hooks/useTheme";
import * as XLSX from "xlsx"; // ⬅️ Add to your imports

import { cn } from "./utils/cn";

ChartJS.register(ArcElement, Tooltip, Legend);

const App = () => {
  const { theme, toggleTheme } = useTheme();
  const [income, setIncome] = useState<string>("");
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const { format, parseCurrency } = useCurrency();

  const {
    categories,
    addCategory,
    handleSubcategoryChange,
    handleSubcategoryLabelChange,
    addSubcategory,
    deleteSubcategory,
    deleteCategory,
  } = useCategories();

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    addCategory(newCategoryName);
    setShowAddCategoryModal(false);
    setNewCategoryName("");
  };

  // inside your component
  const handleExportToExcel = () => {
    // Transform your categories into flat rows
    const rows = categories.flatMap((cat) =>
      cat.subcategories.map((sub) => ({
        Category: cat.title,
        Subcategory: sub.label,
        Amount: sub.value,
      })),
    );

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Budget");

    // Trigger download
    XLSX.writeFile(workbook, "budget-export.xlsx");
  };

  const formatCurrency = (value: string) => {
    if (value === "") return "";
    const cleaned = value.replace(/[^0-9.]/g, "");
    const num = parseFloat(cleaned);
    if (isNaN(num)) return value;
    return num.toFixed(2);
  };

  const categoryTotals = categories.map((cat) =>
    cat.subcategories.reduce(
      (sum, sub) => sum + (parseFloat(sub.value) || 0),
      0,
    ),
  );

  const totalSpent = categoryTotals.reduce((a, b) => a + b, 0);
  const incomeAmount = parseCurrency(income);

  return (
    <div
      className={cn(
        "min-h-screen transition-colors w-full px-6 sm:px-10 lg:px-32 mt-10",
        theme === "dark" ? "bg-zinc-900 text-white" : "bg-white text-gray-900",
      )}
    >
      <div className="fixed top-4 right-14 z-50">
        <div onClick={toggleTheme} className="cursor-pointer">
          <PreviewPillSwitchTheme />
        </div>
      </div>

      <div className="w-full max-w-screen-2xl mx-auto flex flex-col gap-5">
        <BudgetAppHeaderCard />
        <div className="flex flex-col lg:flex-row gap-5 w-full">
          <LeftPane
            income={income}
            setIncome={setIncome}
            format={format}
            parseCurrency={parseCurrency}
            categories={categories}
            handleSubcategoryChange={handleSubcategoryChange}
            handleSubcategoryLabelChange={handleSubcategoryLabelChange}
            addSubcategory={addSubcategory}
            deleteSubcategory={deleteSubcategory}
            deleteCategory={deleteCategory}
            setShowAddCategoryModal={setShowAddCategoryModal}
          />

          <RightPane
            format={format}
            totalSpent={totalSpent}
            incomeAmount={incomeAmount}
            categories={categories}
            categoryTotals={categoryTotals}
          />
          <BeforeEffectButton
  onClick={handleExportToExcel}
  className="fixed bottom-8 right-8 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
>
  Export to Excel
</BeforeEffectButton>

        </div>
      </div>
      {showAddCategoryModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">
              New Category
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1 dark:text-neutral-300">
                  Category Name
                </label>
                <ModernSimpleInput
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g. Entertainment"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowAddCategoryModal(false)}
                  className="text-sm px-4 py-2 rounded-md border dark:border-neutral-600 dark:text-neutral-300"
                >
                  Cancel
                </button>
                <button onClick={handleAddCategory}>Add</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
