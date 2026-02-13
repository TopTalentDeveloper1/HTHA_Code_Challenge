/**
 * Utility functions for price comparison logic
 */

const FLOATING_POINT_TOLERANCE = 0.01;

/**
 * Compares a property price against the suburb average
 * Uses a small tolerance for floating-point comparison
 */
export function getPriceComparison(
  price: number,
  average: number
): 'above' | 'below' | 'equal' {
  const difference = Math.abs(price - average);
  
  // Use tolerance to handle floating-point precision issues
  if (difference < FLOATING_POINT_TOLERANCE) {
    return 'equal';
  }
  
  return price > average ? 'above' : 'below';
}
