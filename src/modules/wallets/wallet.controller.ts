import { asyncHandler } from "../../utils/asyncHandler";
import { creditWallet, getMyWallet, transferFunds } from "./wallet.service";

export const getWallet = asyncHandler(
    async (req: any, res: any) => {
        const wallet = await getMyWallet(req.userId!);

        res.status(200).json({
            success: true,
            data: wallet,
            error: null,
        });
    }
);

export const credit = asyncHandler(
    async (req: any, res: any) => {
        const result = await creditWallet(
            req.body
        );

        return res.status(200).json({
            success: true,
            data: result,
            error: null,
        });
    }
);

export const transfer = asyncHandler(async (req: any, res: any) => {
    const transaction =
        await transferFunds(
            req.userId!,
            req.body
        );

    res.status(200).json({
        success: true,
        data: transaction,
        error: null,
    });
});