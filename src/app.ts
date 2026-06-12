import express from "express";

import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/users/users.routes";
import walletRoutes from "./modules/wallets/wallet.routes";
import transactionRoutes from "./modules/transactions/transaction.routes";

import { errorMiddleware } from "./middleware/error.middleware";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/wallets", walletRoutes);
app.use("/api/transactions", transactionRoutes);

app.get("/api/health", (_, res) => {
  res.json({
    success: true,
    data: {
      status: "ok"
    },
    error: null
  });
});

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});


app.use(errorMiddleware);

export default app;
