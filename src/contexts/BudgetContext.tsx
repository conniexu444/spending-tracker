import React, { createContext, useContext, useReducer, ReactNode, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { BudgetState, BudgetAction, Category, Subcategory, BudgetSummary } from '../types';
import { defaultCategories } from '../data/defaultCategories';

// Convert existing categories to include IDs for better tracking
const categoriesWithIds: Category[] = defaultCategories.map(cat => ({
  ...cat,
  id: uuidv4(),
  subcategories: cat.subcategories.map(sub => ({
    ...sub,
    id: uuidv4()
  }))
}));

const initialState: BudgetState = {
  categories: categoriesWithIds,
  income: ''
};

function budgetReducer(state: BudgetState, action: BudgetAction): BudgetState {
  switch (action.type) {
    case 'ADD_CATEGORY':
      return {
        ...state,
        categories: [...state.categories, {
          id: uuidv4(),
          title: action.payload.title.trim(),
          subcategories: []
        }]
      };

    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(cat => cat.id !== action.payload.categoryId)
      };

    case 'UPDATE_SUBCATEGORY_VALUE':
      return {
        ...state,
        categories: state.categories.map(cat =>
          cat.id === action.payload.categoryId
            ? {
                ...cat,
                subcategories: cat.subcategories.map(sub =>
                  sub.id === action.payload.subcategoryId
                    ? { ...sub, value: action.payload.value }
                    : sub
                )
              }
            : cat
        )
      };

    case 'UPDATE_SUBCATEGORY_LABEL':
      return {
        ...state,
        categories: state.categories.map(cat =>
          cat.id === action.payload.categoryId
            ? {
                ...cat,
                subcategories: cat.subcategories.map(sub =>
                  sub.id === action.payload.subcategoryId
                    ? { ...sub, label: action.payload.label }
                    : sub
                )
              }
            : cat
        )
      };

    case 'ADD_SUBCATEGORY':
      return {
        ...state,
        categories: state.categories.map(cat =>
          cat.id === action.payload.categoryId
            ? {
                ...cat,
                subcategories: [...cat.subcategories, {
                  id: uuidv4(),
                  label: '',
                  value: ''
                }]
              }
            : cat
        )
      };

    case 'DELETE_SUBCATEGORY':
      return {
        ...state,
        categories: state.categories.map(cat =>
          cat.id === action.payload.categoryId
            ? {
                ...cat,
                subcategories: cat.subcategories.filter(sub => sub.id !== action.payload.subcategoryId)
              }
            : cat
        )
      };

    case 'SET_CATEGORIES':
      return {
        ...state,
        categories: action.payload.categories
      };

    case 'SET_INCOME':
      return {
        ...state,
        income: action.payload.income
      };

    default:
      return state;
  }
}

interface BudgetContextType {
  state: BudgetState;
  dispatch: React.Dispatch<BudgetAction>;
  actions: {
    addCategory: (title: string) => void;
    deleteCategory: (categoryId: string) => void;
    updateSubcategoryValue: (categoryId: string, subcategoryId: string, value: string) => void;
    updateSubcategoryLabel: (categoryId: string, subcategoryId: string, label: string) => void;
    addSubcategory: (categoryId: string) => void;
    deleteSubcategory: (categoryId: string, subcategoryId: string) => void;
  };
  computed: {
    budgetSummary: BudgetSummary;
    categoryTotals: number[];
  };
  setIncome: (income: string) => void;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

interface BudgetProviderProps {
  children: ReactNode;
}

export const BudgetProvider: React.FC<BudgetProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(budgetReducer, initialState);

  const actions = useMemo(() => ({
    addCategory: (title: string) => {
      dispatch({ type: 'ADD_CATEGORY', payload: { title } });
    },
    deleteCategory: (categoryId: string) => {
      dispatch({ type: 'DELETE_CATEGORY', payload: { categoryId } });
    },
    updateSubcategoryValue: (categoryId: string, subcategoryId: string, value: string) => {
      dispatch({ type: 'UPDATE_SUBCATEGORY_VALUE', payload: { categoryId, subcategoryId, value } });
    },
    updateSubcategoryLabel: (categoryId: string, subcategoryId: string, label: string) => {
      dispatch({ type: 'UPDATE_SUBCATEGORY_LABEL', payload: { categoryId, subcategoryId, label } });
    },
    addSubcategory: (categoryId: string) => {
      dispatch({ type: 'ADD_SUBCATEGORY', payload: { categoryId } });
    },
    deleteSubcategory: (categoryId: string, subcategoryId: string) => {
      dispatch({ type: 'DELETE_SUBCATEGORY', payload: { categoryId, subcategoryId } });
    }
  }), []);

  const computed = useMemo(() => {
    const categoryTotals = state.categories.map(cat =>
      cat.subcategories.reduce((sum, sub) => sum + (parseFloat(sub.value) || 0), 0)
    );
    
    const totalSpent = categoryTotals.reduce((a, b) => a + b, 0);
    const totalIncome = parseFloat(state.income) || 0;
    
    return {
      budgetSummary: {
        totalSpent,
        totalIncome,
        categoryTotals,
        remainingBudget: totalIncome - totalSpent
      },
      categoryTotals
    };
  }, [state.categories, state.income]);

  const setIncome = (income: string) => {
    dispatch({ type: 'SET_INCOME', payload: { income } });
  };

  return (
    <BudgetContext.Provider value={{ 
      state, 
      dispatch, 
      actions, 
      computed,
      setIncome
    }}>
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
};