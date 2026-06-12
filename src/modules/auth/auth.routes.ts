import { Router } from "express";
import { register, login, refresh, logout } from "./auth.controller";
import { asyncHandler } from "../../utils/asyncHandler";
import { loginSchema, logoutSchema, refreshSchema, registerSchema } from "./auth.validation";
import { validate } from "../../middleware/validate.middleware";
import { authenticate } from "../../middleware/auth.middleware";

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
router.post(
    "/logout",
    authenticate,
    validate(logoutSchema),
    asyncHandler(logout)
);

export default router;
