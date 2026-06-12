import { prisma } from "../../config/db";
import { AppError } from "../../utils/AppError";

export async function getCurrentUser(
    userId: string
) {
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            id: true,
            email: true,
            fullName: true,
            phoneNumber: true,
            createdAt: true,
        },
    });

    if (!user) {
        throw new AppError(
            404,
            "User not found"
        );
    }

    return user;
}
