import { useState } from "react";

const currencySymbols: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  KRW: "₩",
  INR: "₹",
};

export function useCurrency(defaultCurrency = "USD") {
  const [currency, setCurrency] = useState<string>(defaultCurrency);

  /**
   * Format a number or string into a currency display string.
   */
  const format = (value: string | number): string => {
    const num =
      typeof value === "string"
        ? parseFloat(value.replace(/[^0-9.]/g, ""))
        : value;

    if (isNaN(num)) return "$0.00";

    const symbol = currencySymbols[currency] || currency;
    return `${symbol}${num.toFixed(2)}`;
  };

  /**
   * Parse a currency string (e.g. "$1,200.00") into a raw float
   */
  const parseCurrency = (value: string): number => {
    const cleaned = value.replace(/[^0-9.-]/g, ""); // allow hyphen
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  };

  return {
    currency, // e.g. "USD"
    setCurrency,
    symbol: currencySymbols[currency] || currency,
    format, // display formatting
    parseCurrency, // raw value parsing
  };
}
