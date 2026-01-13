import type { GHLWebhook } from "../schemas/ghl.schema";
import type { Job } from "../schemas/job.schema";

const normalizeAny = (value: unknown): string => {
  if (value == null) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean")
    return String(value);
  return "";
};

const SERVICE_FUSION_CUSTOM_FIELD_MAP: Record<string, string> = {
  "Shackle Code": "Shackle Code",
  "CBS Code": "CBS Code",
  "Mech Box Code": "Mech Box Code",
  "Alarm Code": "Alarm Code",
  Sqft: "Sq Ft",
  Bedrooms: "Bedrooms",
  "Opportunity ID": "GHL Opportunity ID",
};

export function transformGHLToJob(body: GHLWebhook): Job {
  const payment = body.payment;
  const customer = payment?.customer;
  const custom = body.customData ?? {};
  const lineItems = payment?.line_items ?? [];

  return {
    description: lineItems.map((item) => item.title).join(" and "),
    tech_notes: normalizeAny(custom["Opportunity Notes"]),
    customer_name: normalizeAny(customer?.name),
    // parent_customer: normalizeAny(custom["Service Fusion ID"]),
    status: "unscheduled",
    contact_first_name: normalizeAny(customer?.first_Name),
    contact_last_name: normalizeAny(customer?.last_Name),
    street_1: normalizeAny(custom["Job Address 1"]),
    street_2: normalizeAny(custom["Job Address 2"]),
    city: normalizeAny(custom["Job City"]),
    state_prov: normalizeAny(custom["Job State"]),
    postal_code: normalizeAny(custom["Job Zip Code"]),
    location_name: normalizeAny(custom["Job Address 1"]),
    custom_fields: [
      ...Object.entries(custom)
        .filter(([key]) => key in SERVICE_FUSION_CUSTOM_FIELD_MAP)
        .map(([key, value]) => ({
          name: SERVICE_FUSION_CUSTOM_FIELD_MAP[key],
          value: normalizeAny(value),
        })),
      {
        name: "Invoice Total",
        value:
          payment?.total_amount !== undefined
            ? String(payment.total_amount)
            : "0",
      },
    ],
    tasks: lineItems.map((item) => ({
      description: item.title,
      is_completed: false,
    })),
  };
}
