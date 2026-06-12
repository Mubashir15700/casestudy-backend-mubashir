import { prisma } from "../config/db";
import { JobStatus, JobType } from "../generated/prisma/client";
import { handleSendReceiptEmail } from "./handlers/receipt.handler";
import { handlePaymentWebhook } from "./handlers/paymentWebhook.handler";
import { getBackoffMinutes } from "./retry";

export async function claimNextJob() {
    const job = await prisma.job.findFirst({
        where: {
            status: JobStatus.QUEUED,
            OR: [
                {
                    nextRetryAt: null,
                },
                {
                    nextRetryAt: {
                        lte: new Date(),
                    },
                },
            ],
        },
        orderBy: {
            createdAt: "asc",
        },
    });

    if (!job) {
        return null;
    }

    const claimed = await prisma.job.updateMany({
        where: {
            id: job.id,
            claimedAt: null,
        },
        data: {
            claimedAt: new Date(),
            status: JobStatus.PROCESSING,
        },
    });

    if (claimed.count === 0) {
        return null;
    }

    return job;
}

export async function processJob(job: any) {
    const payload = job.payload as {
        transactionId: string;
    };

    switch (job.type) {
        case JobType.SEND_RECEIPT_EMAIL:
            await handleSendReceiptEmail(
                payload.transactionId
            );
            break;

        case JobType.PROCESS_PAYMENT_WEBHOOK:
            await handlePaymentWebhook(
                payload.transactionId
            );
            break;

        default:
            throw new Error(`Unknown job type: ${job.type}`);
    }
}

export async function processJobs() {
    const job = await claimNextJob();

    if (!job) {
        return;
    }

    try {
        console.log(`Processing job ${job.id} (${job.type})`);

        await processJob(job);

        await prisma.job.update({
            where: {
                id: job.id,
            },
            data: {
                status: JobStatus.DONE,
            },
        });

        console.log(`Job ${job.id} completed successfully`);
    } catch (error) {
        console.error(
            `Job ${job.id} failed`,
            error
        );

        const attempts = job.attempts + 1;

        const backoffMinutes = getBackoffMinutes(attempts);

        if (!backoffMinutes) {
            await prisma.job.update({
                where: {
                    id: job.id,
                },
                data: {
                    status: JobStatus.FAILED,
                    attempts,
                },
            });

            console.error(`
                =====================================
                CRITICAL ALERT

                Job ${job.id} permanently failed.

                =====================================
            `);

            return;
        }

        const nextRetryAt = new Date(
            Date.now() +
            backoffMinutes * 60 * 1000
        );

        await prisma.job.update({
            where: {
                id: job.id,
            },
            data: {
                status: JobStatus.QUEUED,
                attempts,
                claimedAt: null,
                nextRetryAt,
            },
        });

        console.log(`Retrying job ${job.id} in ${backoffMinutes} minute(s)`);
    }
}
