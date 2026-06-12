import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { getMe } from "./users.controller";
import { asyncHandler } from "../../utils/asyncHandler";

const router = Router();

router.get(
    "/me",
    authenticate,
    asyncHandler(getMe)
);

export default router;
