import { z } from "zod";

export const creditSchema = z.object({
    walletId: z.uuid(),
    amount: z.number().int().positive(),
    referenceId: z.string().min(1),
});

export type CreditDto = z.infer<typeof creditSchema>;

export const transferSchema = z.object({
    recipientWalletId: z.uuid(),
    amount: z.number().int().positive(),
    idempotencyKey: z.string().min(1),
});

export type TransferDto = z.infer<typeof transferSchema>;
