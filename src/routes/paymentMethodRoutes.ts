import { Router } from "express";
import { getPaymentMethods } from "../controllers/paymentMethodController.js";

const router = Router();

router.get("/", getPaymentMethods);

export default router;
