import { getCurrentUser } from "./users.service";

export async function getMe(req: any, res: any) {
    const user = await getCurrentUser(
        req.userId!
    );

    return res.status(200).json({
        success: true,
        data: user,
        error: null,
    });
}
