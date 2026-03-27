/**
 * Environment variable validation.
 * Import this module in server entry points to fail fast on missing config.
 */

interface EnvVar {
  name: string;
  required: boolean;
}

const SERVER_ENV_VARS: EnvVar[] = [
  { name: "KORVEX_API_BASE_URL", required: true },
  { name: "PADDLE_CHECKOUT_WEEKLY", required: false },
  { name: "PADDLE_CHECKOUT_MONTHLY", required: false },
  { name: "PADDLE_CHECKOUT_ANNUAL", required: false },
];

/**
 * Validates that all required env vars are set.
 * Call at server startup — throws with a clear message listing all missing vars.
 */
export function validateEnv(): void {
  // Skip validation during build (env vars may not be set yet)
  if (process.env.NODE_ENV === "production" && !process.env.NEXT_PHASE) {
    const missing = SERVER_ENV_VARS.filter(
      (v) => v.required && !process.env[v.name]
    ).map((v) => v.name);

    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missing.join(", ")}. ` +
          "Set these in your deployment environment before starting the server."
      );
    }
  }
}

/** Get a required env var or throw a clear error. */
export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Environment variable ${name} is required but not set. ` +
        "Check your deployment configuration."
    );
  }
  return value;
}
