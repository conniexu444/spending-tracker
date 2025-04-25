// Type definitions
export type Subcategory = {
  label: string;
  value: string;
};

export interface Category {
  title: string;
  subcategories: Subcategory[];
}

// Default data
export const defaultCategories: Category[] = [
  {
    title: "Housing",
    subcategories: [
      { label: "Rent", value: "" },
      { label: "Wifi", value: "" },
      { label: "Electricity", value: "" },
      { label: "Utilities", value: "" },
    ],
  },
  {
    title: "Food",
    subcategories: [
      { label: "Restaurants", value: "" },
      { label: "Groceries", value: "" },
    ],
  },
  {
    title: "Loans",
    subcategories: [],
  },
  {
    title: "Subscriptions",
    subcategories: [],
  },
  {
    title: "Transportation",
    subcategories: [{ label: "Gas", value: "" }],
  },
];
