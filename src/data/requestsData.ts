// src/data/requestsData.ts
export type Request = {
  id: number;
  title: string;
  description: string;
  createdBy: string;
  status: "pending" | "approved" | "rejected";
};

export const procurementRequests: Request[] = [
  { id: 1, title: "Buy Paper", description: "Buy 10 reams of paper", createdBy: "Alice", status: "pending" },
  { id: 2, title: "New Laptop", description: "Procure a laptop for Dev", createdBy: "Bob", status: "approved" },
  { id: 3, title: "Office Chairs", description: "Order 5 chairs", createdBy: "Charlie", status: "rejected" },
];
