export function calculateRevenue(order: any) {
  // This function expects order.total but it's undefined
  if (!order || typeof order.total !== 'number') {
    throw new Error('Order must have a valid total');
  }
  return order.total * 1.1;
}