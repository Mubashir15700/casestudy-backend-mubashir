import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { adminAuth } from "../../middleware/admin.middleware";
import { credit, transfer, getWallet } from "./wallet.controller";
import { validate } from "../../middleware/validate.middleware";
import { creditSchema, transferSchema } from "./wallet.validation";

const router = Router();

router.get(
    "/me",
    authenticate,
    getWallet
);
router.post(
    "/credit",
    adminAuth,
    validate(creditSchema),
    credit
);
router.post(
    "/transfer",
    authenticate,
    validate(transferSchema),
    transfer
);

export default router;
