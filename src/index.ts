import express from "express";
import { env } from "./env";
import { transformGHLToJob } from "./transformers/transformGHLToJob";
import { serviceFusionClient } from "./clients/serviceFusion.client";
import { GHLWebhook } from "./schemas/ghl.schema";

type ServiceFusionWebhook = {
  "Service Fusion Job ID": string;
};

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

app.post("/webhook/service-fusion", async (req, res) => {
  const webhook: ServiceFusionWebhook = req.body;

  console.log("Received Service Fusion webhook: ", webhook);

  const { "Service Fusion Job ID": jobId } = webhook;

  console.log(`Processing Service Fusion Job ID: ${jobId}`);

  const response = await serviceFusionClient.get(`/jobs/${jobId}`);

  console.log("Fetched job details from Service Fusion", {
    status: response.status,
    data: response.data,
  });

  res.status(200).json({ received: true });
});

app.listen(env.PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${env.PORT}`);
});
