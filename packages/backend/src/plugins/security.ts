import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import type { FastifyInstance } from "fastify";
import { getAllowedOrigins, isOriginAllowed } from "../config/cors.js";

const BODY_LIMIT_BYTES = 10 * 1024;

export async function registerSecurityPlugins(
  app: FastifyInstance,
): Promise<void> {
  await app.register(cors, {
    origin: (origin, callback) => {
      callback(null, isOriginAllowed(origin));
    },
    methods: ["GET", "POST", "OPTIONS"],
  });

  await app.register(helmet, {
    global: true,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'none'"],
        frameAncestors: ["'none'"],
      },
    },
    frameguard: { action: "deny" },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    hsts: {
      maxAge: 31_536_000,
      includeSubDomains: true,
    },
  });
}

export { BODY_LIMIT_BYTES, getAllowedOrigins };
