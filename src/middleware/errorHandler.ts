import type { ErrorRequestHandler, Response } from "express";
import type { ApiErrorResponse } from "../types/api.js";

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  _req,
  res: Response<ApiErrorResponse>,
  _next,
) => {
  console.error(error);

  if (res.headersSent) {
    return;
  }

  res.status(500).json({
    error: "Internal server error",
  });
};
