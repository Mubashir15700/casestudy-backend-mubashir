import { getTransactionById, getTransactions } from "./transaction.service";
import { asyncHandler } from "../../utils/asyncHandler";

export const listTransactions = asyncHandler(async (req: any, res: any) => {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 20);

    const result = await getTransactions(
        req.userId!,
        page,
        limit
    );

    res.status(200).json({
        success: true,
        data: result,
        error: null,
    });
});

export const getTransaction = asyncHandler(async (req: any, res: any) => {
    const transaction = await getTransactionById(
        req.userId!,
        req.params.id
    );

    res.status(200).json({
        success: true,
        data: transaction,
        error: null,
    });
});
