export interface Subcategory {
  id: string;
  label: string;
  value: string;
}

export interface Category {
  id: string;
  title: string;
  subcategories: Subcategory[];
}

export interface BudgetSummary {
  totalSpent: number;
  totalIncome: number;
  categoryTotals: number[];
  remainingBudget: number;
}

export interface SankeyFlowData {
  from: string;
  to: string;
  flow: number;
}

export interface ExportOptions {
  includeEmptyCategories: boolean;
  format: 'excel' | 'pdf';
}

// Action types for budget reducer
export type BudgetAction = 
  | { type: 'ADD_CATEGORY'; payload: { title: string } }
  | { type: 'DELETE_CATEGORY'; payload: { categoryId: string } }
  | { type: 'UPDATE_SUBCATEGORY_VALUE'; payload: { categoryId: string; subcategoryId: string; value: string } }
  | { type: 'UPDATE_SUBCATEGORY_LABEL'; payload: { categoryId: string; subcategoryId: string; label: string } }
  | { type: 'ADD_SUBCATEGORY'; payload: { categoryId: string } }
  | { type: 'DELETE_SUBCATEGORY'; payload: { categoryId: string; subcategoryId: string } }
  | { type: 'SET_CATEGORIES'; payload: { categories: Category[] } }
  | { type: 'SET_INCOME'; payload: { income: string } };

export interface BudgetState {
  categories: Category[];
  income: string;
}