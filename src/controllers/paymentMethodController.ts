import type { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma.js";
import type { PaymentMethodResponse } from "../types/paymentMethod.js";

export async function getPaymentMethods(
  _req: Request,
  res: Response<PaymentMethodResponse[]>,
  next: NextFunction,
): Promise<void> {
  try {
    const paymentMethods = await prisma.paymentMethod.findMany({
      orderBy: { id: "asc" },
    });

    res.json(paymentMethods);
  } catch (error) {
    next(error);
  }
}
