/**
 * Formats a number as a currency string using the specified locale and currency
 * @param amount - The number to format
 * @param locale - The locale to use for formatting (defaults to 'en-US')
 * @param currency - The currency code to use (defaults to 'USD')
 * @returns A formatted currency string
 */
export function formatCurrency(
  amount: number,
  locale: string = 'en-US',
  currency: string = 'USD'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
} 