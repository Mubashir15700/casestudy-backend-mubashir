import { Router } from "express";
import { paymentWebhook } from "./webhook.controller";
import { paymentWebhookSchema } from "./webhook.validation";
import { validate } from "../../middleware/validate.middleware";

const router = Router();

router.post(
    "/payment",
    validate(paymentWebhookSchema),
    paymentWebhook
);

export default router;
