import { z } from "zod";

export const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z
    .enum(["firstName", "lastName", "email", "createdAt"])
    .default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export const createPatientSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters.")
    .max(50)
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/, "First name contains invalid characters."),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters.")
    .max(50)
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/, "Last name contains invalid characters."),
  email: z
    .email("Invalid email address.")
    .max(100)
    .refine((v) => v.toLowerCase().endsWith("@gmail.com"), {
      message: "Only @gmail.com addresses are accepted.",
    }),
  countryCode: z
    .string()
    .min(1)
    .max(4)
    .regex(/^\d{1,4}$/, "Country code must be 1–4 digits."),
  phone: z
    .string()
    .min(6)
    .max(15)
    .regex(/^\d{6,15}$/, "Phone number must be 6–15 digits."),
});

export const editPatientSchema = createPatientSchema.partial();
