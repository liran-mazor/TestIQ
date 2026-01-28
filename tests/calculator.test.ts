import { calculateRevenue, calculateDiscount, Order } from '../src/app/calculator';

describe('Revenue Calculator', () => {
  test('should calculate revenue with 10% markup', () => {
    const order: Order = {
      id: 1,
      total: 100,
      customerId: 42,
    };
    
    const revenue = calculateRevenue(order);
    expect(revenue).toBeCloseTo(110, 2);
  });

  test('should calculate revenue for large orders', () => {
    const order: Order = {
      id: 2,
      total: 5000,
      customerId: 99,
    };
    
    const revenue = calculateRevenue(order);
    expect(revenue).toBe(5500);
  });

  // THIS TEST WILL FAIL - Intentional bug demonstration
  test('should handle orders without total', () => {
    const order = {
      id: 3,
      customerId: 50,
      // Missing 'total' property - will cause TypeError
    } as any;
    
    const revenue = calculateRevenue(order);
    expect(revenue).toBe(0); // Expects 0, but will get NaN and crash
  });
});

describe('Discount Calculator', () => {
  test('should calculate 20% discount', () => {
    const discount = calculateDiscount(100, 20);
    expect(discount).toBe(20);
  });

  test('should reject invalid percentage', () => {
    expect(() => calculateDiscount(100, 150)).toThrow('Invalid percentage');
  });
});