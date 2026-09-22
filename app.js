import express from "express";
import { apiroute } from "./src/Routes/index.js";

const app = express();
app.use(express.json());
app.use("/api/v1", apiroute);

// 404
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    message: "Internal server error",
  });
});

export default app;
