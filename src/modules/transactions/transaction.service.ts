import { prisma } from "../../config/db";
import { AppError } from "../../utils/AppError";

export async function getTransactions(
    userId: string,
    page: number,
    limit: number
) {
    const wallet = await prisma.wallet.findUnique({
        where: {
            userId,
        },
    });

    if (!wallet) {
        throw new Error("Wallet not found");
    }

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
        prisma.transaction.findMany({
            where: {
                OR: [
                    { fromWalletId: wallet.id },
                    { toWalletId: wallet.id },
                ],
            },
            orderBy: {
                createdAt: "desc",
            },
            skip,
            take: limit,
        }),

        prisma.transaction.count({
            where: {
                OR: [
                    { fromWalletId: wallet.id },
                    { toWalletId: wallet.id },
                ],
            },
        }),
    ]);

    return {
        items,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
    };
}

export async function getTransactionById(userId: string, transactionId: string) {
    const wallet = await prisma.wallet.findUnique({
        where: {
            userId,
        },
    });

    if (!wallet) {
        throw new AppError(404, "Wallet not found");
    }

    const transaction = await prisma.transaction.findFirst({
        where: {
            id: transactionId,
            OR: [
                { fromWalletId: wallet.id },
                { toWalletId: wallet.id },
            ],
        },
    });

    if (!transaction) {
        throw new AppError(404, "Transaction not found");
    }

    return transaction;
}
