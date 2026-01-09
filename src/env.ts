import { z } from "zod";
import "dotenv/config";

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  SERVICE_FUSION_API_BASE_URL: z.string(),
  SERVICE_FUSION_CLIENT_ID: z.string(),
  SERVICE_FUSION_CLIENT_SECRET: z.string(),
  SERVICE_FUSION_CODE: z.string(),
  REDIRECT_URI: z.string(),
});

export const env = envSchema.parse(process.env);
