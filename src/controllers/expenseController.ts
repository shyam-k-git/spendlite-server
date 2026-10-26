import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { Prisma, type Expense, type Category } from "../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";
import type { ExpenseResponse } from "../types/expense.js";
import type { ApiErrorResponse } from "../types/api.js";

export const createExpenseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(100, "Title cannot exceed 100 characters"),
  amount: z
    .number()
    .finite()
    .positive("Amount must be positive")
    .max(99999999.99, "Amount cannot exceed 99,999,999.99")
    .refine(
      (val) => /^\d+(\.\d{1,2})?$/.test(val.toString()),
      "Amount can have at most 2 decimal places",
    ),
  date: z.iso.date(),
  categoryId: z.number().int().positive(),
});

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;

type ExpenseWithCategory = Expense & { category: Category };

function serializeExpense(expense: ExpenseWithCategory): ExpenseResponse {
  return {
    id: expense.id,
    title: expense.title,
    amount: expense.amount.toNumber(),
    date: expense.date.toISOString().slice(0, 10),
    categoryId: expense.categoryId,
    category: {
      id: expense.category.id,
      name: expense.category.name,
    },
  };
}

export async function getExpenses(
  _req: Request,
  res: Response<ExpenseResponse[]>,
  next: NextFunction,
): Promise<void> {
  try {
    const expenses = await prisma.expense.findMany({
      include: { category: true },
      orderBy: [{ date: "desc" }, { id: "desc" }],
    });

    res.json(expenses.map(serializeExpense));
  } catch (error) {
    next(error);
  }
}

export async function createExpense(
  req: Request<Record<string, never>, ExpenseResponse | ApiErrorResponse, unknown>,
  res: Response<ExpenseResponse | ApiErrorResponse>,
  next: NextFunction,
): Promise<void> {
  try {
    const parsed = createExpenseSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        error: "Validation failed",
        details: parsed.error.flatten(),
      });
      return;
    }

    const expense = await prisma.expense.create({
      data: {
        ...parsed.data,
        date: new Date(`${parsed.data.date}T00:00:00.000Z`),
      },
      include: { category: true },
    });

    res.status(201).json(serializeExpense(expense));
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      res.status(400).json({ error: "Selected category does not exist" });
      return;
    }

    next(error);
  }
}

export async function deleteExpense(
  req: Request<{ id: string }>,
  res: Response<void | ApiErrorResponse>,
  next: NextFunction,
): Promise<void> {
  try {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
      res.status(400).json({ error: "Invalid expense ID" });
      return;
    }

    await prisma.expense.delete({ where: { id } });

    res.status(204).end();
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      res.status(404).json({ error: "Expense not found" });
      return;
    }

    next(error);
  }
}
