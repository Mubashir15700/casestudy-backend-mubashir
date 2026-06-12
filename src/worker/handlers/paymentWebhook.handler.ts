import { prisma } from "../../config/db";
import { TransactionStatus } from "../../generated/prisma/client";

export async function handlePaymentWebhook(transactionId: string) {
    await prisma.transaction.update({
        where: {
            id: transactionId,
        },
        data: {
            status: TransactionStatus.SUCCESS,
        },
    });
}
