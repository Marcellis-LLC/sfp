import { z } from "zod";

const emptyOrString = z.union([z.string(), z.literal("")]).optional();

const ghlLocationSchema = z.looseObject({
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
});

const ghlCustomerSchema = z.looseObject({
  first_Name: emptyOrString,
  last_Name: emptyOrString,
  name: emptyOrString,
});

const ghlLineItemSchema = z.looseObject({
  id: z.string(),
  title: z.string(),
});

const ghlPaymentSchema = z.looseObject({
  line_items: z.array(ghlLineItemSchema).optional(),
  customer: ghlCustomerSchema.optional(),
});

const ghlCustomDataSchema = z.looseObject({
  "Service Fusion ID": emptyOrString,
  "Stripe ID": emptyOrString,
  "Opportunity Notes": emptyOrString,
  "Opportunity ID": emptyOrString,
  "Job Address 1": emptyOrString,
  "Job Address 2": emptyOrString,
  "Gate Code": emptyOrString,
  "Alarm Code": emptyOrString,
  "Job City": emptyOrString,
  "Job State": emptyOrString,
  "Job Zip Code": emptyOrString,
  Sqft: emptyOrString,
  Bedrooms: emptyOrString,
  "Shackle Code": emptyOrString,
  "CBS Code": emptyOrString,
  "Mech Box Code": emptyOrString,
});

export const ghlBodySchema = z.looseObject({
  location: ghlLocationSchema.optional(),
  payment: ghlPaymentSchema.optional(),
  customData: ghlCustomDataSchema.optional(),
});

export const ghlWebhookSchema = z.looseObject({
  id: z.string(),
  receivedAt: z.string(),
  body: ghlBodySchema,
});

export type GHLWebhook = z.infer<typeof ghlWebhookSchema>;
export type GHLBody = z.infer<typeof ghlBodySchema>;
