// Type definitions
export type Subcategory = {
    label: string;
    value: string;
  };
  
  export interface Category {
    title: string;
    description: string;
    subcategories: Subcategory[];
  }
  
  
  // Default data
  export const defaultCategories: Category[] = [
    {
      title: "Housing",
      description: "Expenses related to housing and rent.",
      subcategories: [
        { label: "Rent", value: "" },
        { label: "Wifi", value: "" },
        { label: "Electricity", value: "" },
        { label: "Utilities", value: "" },
      ],
    },
    {
      title: "Food",
      description: "Expenses for groceries and dining out.",
      subcategories: [
        { label: "Restaurants", value: "" },
        { label: "Groceries", value: "" },
      ],
    },
    {
      title: "Loans",
      description: "Loan repayments and debts.",
      subcategories: [],
    },
    {
      title: "Subscriptions",
      description: "Recurring subscription services.",
      subcategories: [],
    },
    {
      title: "Transportation",
      description: "Transportation and commuting costs.",
      subcategories: [
        { label: "Gas", value: "" },
      ],
    },
  ];
  