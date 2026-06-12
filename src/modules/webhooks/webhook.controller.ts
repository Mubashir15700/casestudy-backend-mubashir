import { processWebhook } from "./webhook.service";
import { asyncHandler } from "../../utils/asyncHandler";

export const paymentWebhook = asyncHandler(
    async (req: any, res: any) => {
        const result = await processWebhook(req.body);

        res.status(200).json({
            success: true,
            data: result,
            error: null,
        });
    }
);
