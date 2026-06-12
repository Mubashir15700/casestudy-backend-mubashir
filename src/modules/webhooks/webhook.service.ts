import crypto from "crypto";
import {
    JobType,
    TransactionStatus,
    TransactionType,
} from "../../generated/prisma/client";
import { prisma } from "../../config/db";

export async function processWebhook(
    data: {
        referenceId: string;
        walletId: string;
        amount: number;
    }
) {
    return prisma.$transaction(async (tx) => {
        const transaction = await tx.transaction.create({
            data: {
                toWalletId: data.walletId,
                amount: data.amount,
                type: TransactionType.CREDIT,
                status: TransactionStatus.PENDING,
                referenceId: data.referenceId,
            },
        });

        await tx.job.create({
            data: {
                type: JobType.PROCESS_PAYMENT_WEBHOOK,
                payload: {
                    transactionId: transaction.id,
                },
            },
        });

        return transaction;
    });
}
