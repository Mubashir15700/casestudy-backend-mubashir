import { Router } from "express";
import { register, login, refresh } from "./auth.controller";
import { asyncHandler } from "../../utils/asyncHandler";
import { loginSchema, refreshSchema, registerSchema } from "./auth.validation";
import { validate } from "../../middleware/validate.middleware";

const router = Router();

router.post(
    "/register",
    validate(registerSchema),
    asyncHandler(register)
);
router.post(
    "/login",
    validate(loginSchema),
    asyncHandler(login)
);
router.post(
    "/refresh",
    validate(refreshSchema),
    asyncHandler(refresh)
);

export default router;
