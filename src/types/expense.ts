import type { CategoryResponse } from "./category.js";
import type { PaymentMethodResponse } from "./paymentMethod.js";

export interface ExpenseResponse {
  id: number;
  title: string;
  amount: number;
  date: string;
  categoryId: number;
  category: CategoryResponse;
  paymentMethodId?: number | null;
  paymentMethod?: PaymentMethodResponse | null;
}

export interface CreateExpenseDTO {
  title: string;
  amount: number;
  date: string;
  categoryId: number;
  paymentMethodId?: number | null;
}
