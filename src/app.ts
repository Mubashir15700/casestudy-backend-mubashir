import express from "express";

const app = express();

app.use(express.json());

app.get("/health", (_, res) => {
  res.json({
    success: true,
    data: {
      status: "ok"
    },
    error: null
  });
});

export default app;
