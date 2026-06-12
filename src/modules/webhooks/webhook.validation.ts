import { z } from "zod";

export const paymentWebhookSchema = z.object({
    referenceId: z.string(),
    walletId: z.uuid(),
    amount: z.number().int().positive(),
});
