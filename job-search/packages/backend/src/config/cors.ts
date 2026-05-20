const DEFAULT_ORIGINS = ["http://localhost:5173", "http://127.0.0.1:5173"];

export function getAllowedOrigins(): string[] {
  const fromEnv = process.env.CORS_ORIGINS ?? process.env.FRONTEND_ORIGIN;
  if (!fromEnv) {
    return DEFAULT_ORIGINS;
  }
  return fromEnv.split(",").map((origin) => origin.trim()).filter(Boolean);
}

export function isOriginAllowed(origin: string | undefined): boolean {
  if (!origin) {
    return true;
  }
  return getAllowedOrigins().includes(origin);
}
