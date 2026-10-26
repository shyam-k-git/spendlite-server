
import type { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma.js";
import type { CategoryResponse } from "../types/category.js";

export async function getCategories(
  _req: Request,
  res: Response<CategoryResponse[]>,
  next: NextFunction,
): Promise<void> {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { id: "asc" },
    });

    res.json(categories);
  } catch (error) {
    next(error);
  }
}
