import { custom, z } from "zod";

const emptyOrString = z.union([z.string(), z.literal("")]).optional();

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

export const ghlWebhookSchema = z.looseObject({
  payment: ghlPaymentSchema.optional(),
  customData: ghlCustomDataSchema.optional(),
});

export type GHLWebhook = z.infer<typeof ghlWebhookSchema>;
