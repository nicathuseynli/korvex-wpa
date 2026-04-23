import { z } from "zod";
import { ACTIVATION_KEY_REGEX } from "@/lib/constants";

export const activationKeySchema = z
  .string()
  .regex(ACTIVATION_KEY_REGEX, "Invalid key format")
  .transform((v) => v.toLowerCase());

export const activateFormSchema = z.object({
  key: activationKeySchema,
});

// Preserved for existing API route compatibility
export const identifySchema = z.object({
  telegramId: z.string().min(1, "Telegram ID обязателен"),
  username: z.string().optional(),
});

export type ActivationKeyInput = z.infer<typeof activationKeySchema>;
export type ActivateFormInput = z.infer<typeof activateFormSchema>;
export type IdentifyInput = z.infer<typeof identifySchema>;

export const emailSchema = z
  .string()
  .trim()
  .min(3)
  .max(254)
  .email()
  .transform((v) => v.toLowerCase());

export const checkoutSchema = z.object({
  email: emailSchema,
  planId: z.string().min(1).max(40).regex(/^[a-z0-9_]+$/),
});

export const resendSchema = z.object({
  email: emailSchema,
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type ResendInput = z.infer<typeof resendSchema>;
