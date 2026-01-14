import express from "express";
import { env } from "./env";
import { transformGHLToJob } from "./transformers/transformGHLToJob";
import { serviceFusionClient } from "./clients/serviceFusion.client";
import { GHLWebhook } from "./schemas/ghl.schema";

const app = express();

app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

app.post("/webhook/ghl", async (req, res) => {
  try {
    const webhook: GHLWebhook = req.body;

    console.log("Received GHL webhook: ", webhook);

    const job = transformGHLToJob(webhook);

    console.log("Transformed job: ", job);

    const response = await serviceFusionClient.post("/jobs", job);

    console.log("Service Fusion response", {
      status: response.status,
      data: response.data,
    });

    return res.status(200).json({ created: true });
  } catch (error: any) {
    console.error("Webhook processing failed", {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data,
    });

    return res.status(500).json({
      error: "Failed to create job",
    });
  }
});

let lastWebhookData: any = null;

app.post("/webhook/service-fusion", async (req, res) => {
  console.log("Received Webhook: ", req.body);
  lastWebhookData = req.body;
  res.status(200).json({ received: true });
});

app.get("/webhook/view", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Webhook Payload</title>
        <style>
          body { font-family: monospace; background: #111; color: #0f0; }
          pre { white-space: pre-wrap; word-wrap: break-word; }
        </style>
      </head>
      <body>
        <h1>Last Webhook Payload</h1>
        <pre>${JSON.stringify(lastWebhookData, null, 2)}</pre>
      </body>
    </html>
  `);
});

app.listen(env.PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${env.PORT}`);
});
