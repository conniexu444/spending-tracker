/**
 * Formats a numeric string to currency with optional symbol
 * @param value Raw input value
 * @param symbol Default is "$"
 */
export function formatCurrency(value: string, symbol = "$"): string {
  if (value === "") return "";
  const cleaned = value.replace(/[^0-9.]/g, "");
  const num = parseFloat(cleaned);
  if (isNaN(num)) return value;
  return `${symbol}${num.toFixed(2)}`;
}
