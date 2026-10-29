import "dotenv/config";
import express from "express";
import cors from "cors";
import expenseRoutes from "./routes/expenseRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import paymentMethodRoutes from "./routes/paymentMethodRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const port = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});
app.use("/api/categories", categoryRoutes);
app.use("/api/payment-methods", paymentMethodRoutes);
app.use("/api/expenses", expenseRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
