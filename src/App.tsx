import React, { useState, useCallback, useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Context and Hooks
import { BudgetProvider, useBudget } from './contexts/BudgetContext';
import { useTheme } from './hooks/useTheme';
import { useCurrency } from './hooks/useCurrency';

// Components
import { ErrorBoundary, Modal, Button, Input } from './components/ui';
import BudgetAppHeaderCard from './components/layout/BudgetAppHeaderCard';
import LeftPane from './components/layout/LeftPane';
import RightPane from './components/layout/RightPane';
import PreviewPillSwitchTheme from './components/ui/ThemeToggle';
import { BeforeEffectButton } from './components/ui/BeforeEffectButton';

// Utils and Constants
import { exportCategoriesToExcelWithStyle } from './utils/exportToExcel';
import { exportCategoriesToPDF } from './utils/exportCategoriesToPdf';
import { cn } from './utils/cn';
import { APP_CONFIG, UI_CONFIG, VALIDATION } from './constants/app';

// Assets
import ExcelIcon from './assets/excel.png';
import PdfIcon from './assets/pdf-icon.png';
import GithubIcon from './assets/github-logo.png';

ChartJS.register(ArcElement, Tooltip, Legend);

// Separate component for the floating action buttons
const FloatingActions: React.FC<{
  onExportExcel: () => void;
  onExportPDF: () => void;
  onToggleTheme: () => void;
}> = React.memo(({ onExportExcel, onExportPDF, onToggleTheme }) => (
  <>
    {/* Theme Toggle */}
    <div className="fixed top-4 right-14 z-50">
      <div onClick={onToggleTheme} className="cursor-pointer">
        <PreviewPillSwitchTheme />
      </div>
    </div>

    {/* PDF Export Button */}
    <div className="fixed bottom-[5rem] right-10 z-50">
      <BeforeEffectButton
        onClick={onExportPDF}
        className={cn(
          'p-3 rounded-full',
          UI_CONFIG.animations.transition,
          UI_CONFIG.animations.hover
        )}
        aria-label="Export to PDF"
      >
        <img src={PdfIcon} alt="Export to PDF" className="w-8 h-8" />
      </BeforeEffectButton>
    </div>

    {/* Excel Export Button */}
    <div className="fixed bottom-5 right-10 z-50">
      <BeforeEffectButton
        onClick={onExportExcel}
        className={cn(
          'p-3 rounded-full',
          UI_CONFIG.animations.transition,
          UI_CONFIG.animations.hover
        )}
        aria-label="Export to Excel"
      >
        <img src={ExcelIcon} alt="Export to Excel" className="w-8 h-8" />
      </BeforeEffectButton>
    </div>

    {/* GitHub Link */}
    <div className="fixed bottom-5 left-10 z-50">
      <BeforeEffectButton
        onClick={() => window.open(APP_CONFIG.github.url, '_blank')}
        className={cn(
          'p-3 rounded-full',
          UI_CONFIG.animations.transition,
          UI_CONFIG.animations.hover
        )}
        aria-label={APP_CONFIG.github.label}
      >
        <img src={GithubIcon} alt="GitHub" className="w-8 h-8" />
      </BeforeEffectButton>
    </div>
  </>
));

// Modal component for adding new categories
const AddCategoryModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string) => void;
}> = React.memo(({ isOpen, onClose, onAdd }) => {
  const [categoryName, setCategoryName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = useCallback(() => {
    const trimmedName = categoryName.trim();
    
    if (!trimmedName) {
      setError('Category name is required');
      return;
    }
    
    if (trimmedName.length < VALIDATION.category.minLength) {
      setError(`Category name must be at least ${VALIDATION.category.minLength} character(s)`);
      return;
    }
    
    if (trimmedName.length > VALIDATION.category.maxLength) {
      setError(`Category name must be less than ${VALIDATION.category.maxLength} characters`);
      return;
    }

    onAdd(trimmedName);
    setCategoryName('');
    setError('');
    onClose();
  }, [categoryName, onAdd, onClose]);

  const handleClose = useCallback(() => {
    setCategoryName('');
    setError('');
    onClose();
  }, [onClose]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  }, [handleSubmit]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add New Category"
      size="medium"
    >
      <div className="space-y-4">
        <div>
          <label 
            htmlFor="category-name"
            className="text-sm font-medium block mb-1 dark:text-neutral-300"
          >
            Category Name
          </label>
          <Input
            id="category-name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. Entertainment"
            aria-label="Category name"
            required
          />
          {error && (
            <p className="text-red-500 text-sm mt-1" role="alert">
              {error}
            </p>
          )}
        </div>
        
        <div className="flex justify-end gap-2 pt-2">
          <Button
            variant="secondary"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!categoryName.trim()}
          >
            Add Category
          </Button>
        </div>
      </div>
    </Modal>
  );
});

// Main App Content component (separated for cleaner code)
const AppContent: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { format, parseCurrency } = useCurrency();
  const { state, actions, computed, setIncome } = useBudget();
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);

  // Memoized handlers to prevent unnecessary re-renders
  const handleExportToExcel = useCallback(() => {
    exportCategoriesToExcelWithStyle(state.categories);
  }, [state.categories]);

  const handleExportToPDF = useCallback(() => {
    exportCategoriesToPDF(state.categories);
  }, [state.categories]);

  const handleAddCategory = useCallback((title: string) => {
    actions.addCategory(title);
  }, [actions]);

  const handleOpenAddModal = useCallback(() => {
    setShowAddCategoryModal(true);
  }, []);

  const handleCloseAddModal = useCallback(() => {
    setShowAddCategoryModal(false);
  }, []);

  // Memoized computed values
  const incomeAmount = useMemo(() => parseCurrency(state.income), [state.income, parseCurrency]);

  return (
    <div
      className={cn(
        'min-h-screen transition-colors w-full px-6 sm:px-10 lg:px-32 mt-10',
        theme === 'dark' ? 'bg-zinc-900 text-white' : 'bg-white text-gray-900'
      )}
    >
      <FloatingActions
        onExportExcel={handleExportToExcel}
        onExportPDF={handleExportToPDF}
        onToggleTheme={toggleTheme}
      />

      <div className="w-full max-w-screen-2xl mx-auto flex flex-col gap-5">
        <BudgetAppHeaderCard />
        
        <div className="flex flex-col lg:flex-row gap-5 w-full">
          <LeftPane
            income={state.income}
            setIncome={setIncome}
            format={format}
            parseCurrency={parseCurrency}
            categories={state.categories}
            handleSubcategoryChange={actions.updateSubcategoryValue}
            handleSubcategoryLabelChange={actions.updateSubcategoryLabel}
            addSubcategory={actions.addSubcategory}
            deleteSubcategory={actions.deleteSubcategory}
            deleteCategory={actions.deleteCategory}
            setShowAddCategoryModal={handleOpenAddModal}
          />

          <RightPane
            format={format}
            totalSpent={computed.budgetSummary.totalSpent}
            incomeAmount={incomeAmount}
            categories={state.categories}
            categoryTotals={computed.categoryTotals}
          />
        </div>
      </div>

      <AddCategoryModal
        isOpen={showAddCategoryModal}
        onClose={handleCloseAddModal}
        onAdd={handleAddCategory}
      />
    </div>
  );
};

// Error fallback component
const AppErrorFallback: React.FC<{ error: Error; resetError: () => void }> = ({ 
  error, 
  resetError 
}) => (
  <div className="flex items-center justify-center min-h-screen bg-red-50 dark:bg-red-900/20">
    <div className="text-center p-6 max-w-md">
      <h1 className="text-2xl font-bold text-red-600 mb-4">
        Budget App Error
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        Something went wrong with the budget application: {error.message}
      </p>
      <Button onClick={resetError}>
        Restart Application
      </Button>
    </div>
  </div>
);

// Main App component with all providers
const App: React.FC = () => {
  return (
    <ErrorBoundary fallback={AppErrorFallback}>
      <BudgetProvider>
        <AppContent />
      </BudgetProvider>
    </ErrorBoundary>
  );
};

export default App;