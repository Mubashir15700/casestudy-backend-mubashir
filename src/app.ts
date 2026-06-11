import express from "express";

import authRoutes from "./modules/auth/auth.routes";
import { errorMiddleware } from "./middleware/error.middleware";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/health", (_, res) => {
  res.json({
    success: true,
    data: {
      status: "ok"
    },
    error: null
  });
});

app.use(errorMiddleware);

export default app;
