import express, { Request, Response } from "express";
import { env } from "./config/env.js";
import crypto from "crypto";

const app = express();

app.use(express.json());

type StoredPayload = {
  id: string;
  receivedAt: string;
  body: unknown;
};

const receivedPayloads: Record<string, unknown>[] = [];

app.post("/webhook/ghl", (req: Request, res: Response) => {
  const stored: StoredPayload = {
    id: crypto.randomUUID(),
    receivedAt: new Date().toISOString(),
    body: req.body,
  };

  receivedPayloads.push(stored);

  console.log("Received GHL payload:", stored);

  res.status(200).json({
    success: true,
    message: "Payload received",
  });
});

app.get("/debug/payloads", (_req: Request, res: Response) => {
  res.json({
    count: receivedPayloads.length,
    payloads: receivedPayloads,
  });
});

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.listen(env.PORT, () => {
  console.log(`🚀 Server running on http://localhost:${env.PORT}`);
});
