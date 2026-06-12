import { prisma } from "../../config/db";
import { CreditDto, TransferDto } from "./wallet.validation";
import { TransactionStatus, TransactionType } from "../../generated/prisma/enums";
import { AppError } from "../../utils/AppError";

export async function getMyWallet(userId: string) {
    const wallet = await prisma.wallet.findUnique({
        where: {
            userId,
        },
    });

    if (!wallet) {
        throw new AppError(404, "Wallet not found");
    }

    return wallet;
}

export async function creditWallet(data: CreditDto) {
    const existingTransaction = await prisma.transaction.findUnique({
        where: {
            referenceId: data.referenceId,
        },
    });

    if (existingTransaction) {
        throw new AppError(
            409,
            "Reference ID already exists"
        );
    }

    const wallet = await prisma.wallet.findUnique({
        where: {
            id: data.walletId,
        },
    });

    if (!wallet) {
        throw new AppError(
            404,
            "Wallet not found"
        );
    }

    return prisma.$transaction(async (tx) => {
        const updatedWallet = await tx.wallet.update({
            where: {
                id: wallet.id,
            },
            data: {
                balance: {
                    increment: data.amount,
                },
            },
        });

        const transaction = await tx.transaction.create({
            data: {
                toWalletId: wallet.id,
                amount: data.amount,
                type: TransactionType.CREDIT,
                status: TransactionStatus.SUCCESS,
                referenceId: data.referenceId,
            },
        });

        return {
            wallet: updatedWallet,
            transaction,
        };
    });
}

export async function transferFunds(userId: string, data: TransferDto) {
    // Check for existing transaction with the same idempotency key
    const existing = await prisma.transaction.findUnique({
        where: {
            idempotencyKey: data.idempotencyKey,
        },
    });

    if (existing) {
        return existing;
    }

    const senderWallet = await prisma.wallet.findUnique({
        where: {
            userId,
        },
    });

    if (!senderWallet) {
        throw new AppError(
            404,
            "Sender wallet not found"
        );
    }

    const recipientWallet = await prisma.wallet.findUnique({
        where: {
            id: data.recipientWalletId,
        },
    });

    if (!recipientWallet) {
        throw new AppError(
            404,
            "Recipient wallet not found"
        );
    }

    if (senderWallet.id === recipientWallet.id) {
        throw new AppError(
            400,
            "Cannot transfer to same wallet"
        );
    }

    return prisma.$transaction(async (tx) => {
        const walletIds = [
            senderWallet.id,
            recipientWallet.id,
        ].sort();

        await tx.$queryRaw`
            SELECT id
            FROM wallets
            WHERE id IN (${walletIds[0]}, ${walletIds[1]})
            FOR UPDATE
        `;

        const lockedSender = await tx.wallet.findUnique({
            where: {
                id: senderWallet.id,
            },
        });

        if (!lockedSender) {
            throw new AppError(
                404,
                "Sender wallet not found"
            );
        }

        if (lockedSender.balance < data.amount) {
            throw new AppError(
                400,
                "Insufficient funds"
            );
        }

        await tx.wallet.update({
            where: {
                id: senderWallet.id,
            },
            data: {
                balance: {
                    decrement: data.amount,
                },
            },
        });

        await tx.wallet.update({
            where: {
                id: recipientWallet.id,
            },
            data: {
                balance: {
                    increment: data.amount,
                },
            },
        });

        const transaction = await tx.transaction.create({
            data: {
                fromWalletId: senderWallet.id,
                toWalletId: recipientWallet.id,
                amount: data.amount,
                type: TransactionType.TRANSFER,
                status: TransactionStatus.SUCCESS,
                referenceId: crypto.randomUUID(),
                idempotencyKey:
                    data.idempotencyKey,
            },
        });

        await tx.job.create({
            data: {
                type: "SEND_RECEIPT_EMAIL",
                payload: {
                    transactionId: transaction.id,
                },
            },
        });

        return transaction;
    });
}
