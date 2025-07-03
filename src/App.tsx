import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useState } from "react";
import RightPane from "./components/right-pane";
import LeftPane from "./components/left-pane";
import ExcelIcon from "./assets/excel.png";
import PdfIcon from "./assets/pdf-icon.png";
import GithubIcon from "./assets/github-logo.png";
import BudgetAppHeaderCard from "./components/BudgetAppHeaderCard";
import { ModernSimpleInput } from "./components/ModernSimpleInput";
import PreviewPillSwitchTheme from "./components/toggle-theme-icon";
import { BeforeEffectButton } from "./components/BeforeEffectButton";
import { useCategories } from "./hooks/useCategories";
import { useCurrency } from "./hooks/useCurrency";
import { useTheme } from "./hooks/useTheme";
import { exportCategoriesToExcelWithStyle } from "./utils/exportToExcel";
import { cn } from "./utils/cn";
import { exportCategoriesToPDF } from "./utils/exportCategoriesToPdf";

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

  const handleExportToExcel = () => {
    exportCategoriesToExcelWithStyle(categories);
  };

  const handleExportToPDF = () => {
    exportCategoriesToPDF(categories);
  };

  const categoryTotals = categories.map((cat) =>
    cat.subcategories.reduce(
      (sum, sub) => sum + (parseFloat(sub.value) || 0),
      0
    )
  );

  const totalSpent = categoryTotals.reduce((a, b) => a + b, 0);
  const incomeAmount = parseCurrency(income);

  return (
    <div
      className={cn(
        "min-h-screen transition-colors w-full px-6 sm:px-10 lg:px-32 mt-10",
        theme === "dark" ? "bg-zinc-900 text-white" : "bg-white text-gray-900"
      )}
    >
      <div className="fixed top-4 right-14 z-50">
        <div onClick={toggleTheme} className="cursor-pointer">
          <PreviewPillSwitchTheme />
        </div>
      </div>

      {/* PDF Button */}
      <div className="fixed bottom-[5rem] right-10 z-50">
        <BeforeEffectButton
          onClick={handleExportToPDF}
          className="p-3 rounded-full transition transform hover:-translate-y-1 hover:scale-105"
        >
          <img src={PdfIcon} alt="To PDF Button" className="w-8 h-8" />
        </BeforeEffectButton>
      </div>

      {/* Excel Button */}
      <div className="fixed bottom-5 right-10 z-50">
        <BeforeEffectButton
          onClick={handleExportToExcel}
          className="p-3 rounded-full transition transform hover:-translate-y-1 hover:scale-105"
        >
          <img src={ExcelIcon} alt="To Excel Button" className="w-8 h-8" />
        </BeforeEffectButton>
      </div>

      {/* Github Button */}
      <div className="fixed bottom-5 left-10 z-50">
        <BeforeEffectButton
          onClick={() =>
            window.open("https://github.com/conniexu444", "_blank")
          }
          className="p-3 rounded-full transition transform hover:-translate-y-1 hover:scale-105"
        >
          <img src={GithubIcon} alt="To Github Button" className="w-8 h-8" />
        </BeforeEffectButton>
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
