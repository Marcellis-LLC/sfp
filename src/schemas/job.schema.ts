import { z } from "zod";

export const JobSchema = z.object({
  description: z.string(), // Loop the line_items from GHL Payload and extract each title to create the description
  tech_notes: z.string(), // customData["Opportunity Notes"] from GHL Payload
  customer_name: z.string(), // customer.name from GHL Payload
  // parent_customer: z.string(), // customData["Service Fusion ID"] from GHL Payload
  status: z.literal("unscheduled"),
  contact_first_name: z.string(), // customer.first_name from GHL Payload
  contact_last_name: z.string(), // customer.last_name from GHL Payload
  street_1: z.string(), // location.address from GHL Payload
  street_2: z.string().optional(), // N/A
  city: z.string(), // location.city from GHL Payload
  state_prov: z.string(), // location.state from GHL Payload
  postal_code: z.string(), // location.postalCode from GHL Payload
  location_name: z.string(), // location.address from GHL Payload
  custom_fields: z.array(
    z.object({
      name: z.string(),
      value: z.any(),
      type: z.string().optional(),
      group: z.string().optional(),
      created_at: z.string().optional(),
      updated_at: z.string().optional(),
      is_required: z.boolean().optional(),
    })
  ),
  tasks: z.array(
    // Loop the line_items from GHL Payload to create tasks using each item's title and set is_completed to false
    z.object({
      description: z.string(),
      is_completed: z.boolean().default(false),
    })
  ),
});

export type Job = z.infer<typeof JobSchema>;
