import { prisma } from "../../config/db";
import { TransactionStatus } from "../../generated/prisma/enums";

async function handleSendReceiptEmail(transactionId: string) {
    const transaction = await prisma.transaction.findUnique({
        where: {
            id: transactionId,
        },
    });

    if (!transaction) {
        throw new Error("Transaction not found");
    }

    console.log(`
        =====================================
        RECEIPT EMAIL

        Transaction ID : ${transaction.id}
        Amount         : ${transaction.amount}
        Type           : ${transaction.type}
        Status         : ${transaction.status}

        =====================================
    `);
}

async function handleProcessPaymentWebhook(transactionId: string) {
    await prisma.transaction.update({
        where: {
            id: transactionId,
        },
        data: {
            status: TransactionStatus.SUCCESS,
        },
    });

    console.log(`Payment transaction ${transactionId} marked SUCCESS`);
}

export { handleSendReceiptEmail, handleProcessPaymentWebhook };
