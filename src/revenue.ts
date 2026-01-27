export function calculateRevenue(order: any) {
  // This function expects order.total but it's undefined
  return order.total * 1.1; // Bug: order.total might be undefined
}