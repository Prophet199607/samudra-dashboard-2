// Mock data for orders
export const generateMockOrders = (count = 25) => {
  return Array.from({ length: count }, (_, index) => ({
    id: `ORD-${String(index + 1).padStart(5, "0")}`,
    customerName: `Customer ${index + 1}`,
    date: new Date(
      Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
    ).toISOString(),
    status: Math.floor(Math.random() * 9) + 1, // Random number between 1-9 representing steps
    totalAmount: (Math.random() * 10000).toFixed(2),
  }));
};

export const mockOrders = generateMockOrders();
