import { z } from "zod";

const envSchema = z.object({
  PORT: z
    .string()
    .default("3000")
    .transform((val) => parseInt(val, 10)),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:");

  parsed.error.issues.forEach((issue) => {
    console.error(`- ${issue.path.join(".")}: ${issue.message}`);
  });

  throw new Error("Environment validation failed");
}

export const env = parsed.data;
export type Env = z.infer<typeof envSchema>;
