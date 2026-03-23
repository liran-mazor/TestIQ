export interface Order {
  id: number;
  total: number;
  customerId: number;
}

export function calculateRevenue(order: Order): number {
  // BUG: No validation - will crash if order.total is undefined
  return order.total * 1.1;
}

export function calculateDiscount(amount: number, percentage: number): number {
  if (percentage < 0 || percentage > 100) {
    throw new Error('Invalid percentage');
  }
  return amount * (percentage / 100);
}// Test change for CI integration
