import type { CategoryResponse } from "./category.js";

export interface ExpenseResponse {
  id: number;
  title: string;
  amount: number;
  date: string;
  categoryId: number;
  category: CategoryResponse;
}

export interface CreateExpenseDTO {
  title: string;
  amount: number;
  date: string;
  categoryId: number;
}
