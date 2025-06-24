// src/server.ts
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import path from "path";
import { authRoutes } from "./routes/auth";
import { influencerRoutes } from "./routes/influencers";
import { mentionRoutes } from "./routes/mentions";
import { projectRoutes } from "./routes/projects";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const isDev = process.env.NODE_ENV !== "production";

app.use("/api/auth", authRoutes);
app.use("/api/influencers", influencerRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/mentions", mentionRoutes);

if (isDev) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:5173",
      changeOrigin: true,
      ws: true,
    })
  );

  app.use(
    "/",
    createProxyMiddleware({
      target: "http://localhost:5173",
      changeOrigin: true,
      ws: true,
    })
  );
} else {
  app.use(express.static(path.join(__dirname, "../../frontend/dist")));

  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
  });
}

const PORT = Number(process.env.PORT) || 3001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Listening on ${PORT}`);
});
