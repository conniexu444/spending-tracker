import { useState } from "react";
import { cn } from "./utils/cn";
import PreviewPillSwitchTheme from "./components/toggle-theme-icon";
import BudgetAppHeaderCard from "./components/BudgetAppHeaderCard";
import { ModernSimpleInput } from "./components/ModernSimpleInput";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut, Pie } from "react-chartjs-2";
import { useTheme } from "./hooks/useTheme";
import { useCategories } from "./hooks/useCategories";
import { useCurrency } from "./hooks/useCurrency";
import CategoryCard from "./components/category-card";
import MonthlyIncomeCard from "./components/monthly-income-card";
import { ShinyRotatingBorderButton } from "./components/shiny-button";
import { MainMenusCompactCard } from "./components/gradient-card-compact";

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
  const remaining = Math.max(0, incomeAmount - totalSpent);

  return (
    <div
      className={cn(
        "min-h-screen transition-colors w-full px-6 sm:px-10 lg:px-24 mt-10",
        theme === "dark" ? "bg-zinc-900 text-white" : "bg-white text-gray-900",
      )}
    >
      <div className="fixed top-4 right-14 z-50">
        <div onClick={toggleTheme} className="cursor-pointer">
          <PreviewPillSwitchTheme />
        </div>
      </div>

      <div className="w-full max-w-screen-2xl mx-auto flex flex-col gap-6">
        <div className="flex flex-col lg:flex-row gap-10 w-full">
          <div className="w-full lg:w-3/5 flex flex-col gap-6">
            <BudgetAppHeaderCard />
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

            <ShinyRotatingBorderButton
              onClick={() => setShowAddCategoryModal(true)}
            >
              + Add New Category
            </ShinyRotatingBorderButton>
          </div>

          <div className="flex flex-col items-center gap-8 w-full max-w-md">
            <div className="w-full">
              <div className="w-full flex flex-col sm:flex-row items-stretch gap-4 mb-4">
                <div className="flex-1">
                  <MainMenusCompactCard
                    className="flex-1"
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
                </div>

                <div className="flex-1">
                  <MainMenusCompactCard
                    className="flex-1"
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
                </div>
              </div>

              <MainMenusCompactCard
                className="w-full"
                header={
                  <div className="text-sm font-medium text-center text-neutral-700 dark:text-neutral-300 py-1">
                    Spending Breakdown
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
                      ],
                      borderWidth: 1,
                    },
                  ],
                }}
              />
            </div>

            <div className="w-full">
              <MainMenusCompactCard
                className="w-full"
                header={
                  <div className="text-sm font-medium text-center text-neutral-700 dark:text-neutral-300 py-1">
                    Remaining Budget
                  </div>
                }
              />

              <Doughnut
                data={{
                  labels: ["Spent", "Remaining"],
                  datasets: [
                    {
                      label: "Budget",
                      data: [
                        totalSpent,
                        Math.max(0, incomeAmount - totalSpent),
                      ],
                      backgroundColor: ["#f87171", "#4ade80"],
                      borderWidth: 1,
                    },
                  ],
                }}
              />
            </div>
          </div>
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
