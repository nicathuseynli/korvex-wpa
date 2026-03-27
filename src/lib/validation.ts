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
