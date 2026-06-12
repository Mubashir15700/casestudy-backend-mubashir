import { Router } from "express";
import { getTransaction, listTransactions } from "./transaction.controller";
import { authenticate } from "../../middleware/auth.middleware";

const router = Router();

router.get(
    "/",
    authenticate,
    listTransactions
);
router.get(
    "/:id",
    authenticate,
    getTransaction
);

export default router;
