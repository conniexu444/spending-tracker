import { useState } from "react";
import { cn } from "./utils/cn";
import PreviewPillSwitchTheme from "./components/PreviewPillSwitchTheme";
import BudgetAppHeaderCard from "./components/BudgetAppHeaderCard";
import { ModernSimpleInput } from "./components/ModernSimpleInput";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut, Pie } from "react-chartjs-2";
import { MainMenusGradientCard } from "./components/gradient-card";
import { useTheme } from "./hooks/useTheme";
import { useCategories } from "./hooks/useCategories";
import { useCurrency } from "./hooks/useCurrency";
import CategoryCard from "./components/category-card";
import MonthlyIncomeCard from "./components/monthly-income-card";

ChartJS.register(ArcElement, Tooltip, Legend);

const App = () => {
  const { theme, toggleTheme } = useTheme();
  const [income, setIncome] = useState<string>("");
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
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
    addCategory(newCategoryName, newCategoryDescription);
    setShowAddCategoryModal(false);
    setNewCategoryName("");
    setNewCategoryDescription("");
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
        <BudgetAppHeaderCard />

        <div className="flex flex-col lg:flex-row gap-10 w-full">
          <div className="w-full max-w-4xl flex flex-col gap-6">
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

            <button
              onClick={() => setShowAddCategoryModal(true)}
              className="text-blue-600 hover:underline text-sm mt-2 self-start"
            >
              + Add New Category
            </button>
          </div>

          <div className="flex flex-col items-center gap-8 w-full max-w-md">
            <div className="w-full">
              <div className="w-full flex flex-col sm:flex-row items-stretch gap-4 mb-4">
                <MainMenusGradientCard
                  title="Total Spent"
                  className="flex-1 px-4 py-2"
                  withArrow={false}
                >
                  <p className="text-lg font-semibold text-gray-900 dark:text-white px-2">
                    {format(totalSpent.toString())}
                  </p>
                </MainMenusGradientCard>

                <MainMenusGradientCard
                  title="Total Left"
                  className="flex-1 px-4 py-2"
                  withArrow={false}
                >
                  <p className="text-lg font-semibold text-gray-900 dark:text-white px-2">
                    {format(remaining.toString())}
                  </p>
                </MainMenusGradientCard>
              </div>

              <h2 className="text-center font-semibold mb-2">
                Spending Breakdown
              </h2>
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
              <h2 className="text-center font-semibold mb-2">
                Remaining Budget
              </h2>
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

              <div>
                <label className="text-sm font-medium block mb-1 dark:text-neutral-300">
                  Description (optional)
                </label>
                <ModernSimpleInput
                  type="text"
                  value={newCategoryDescription}
                  onChange={(e) => setNewCategoryDescription(e.target.value)}
                  placeholder="e.g. Concerts, movies, hobbies"
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
