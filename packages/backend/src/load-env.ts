import { config } from "dotenv";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/** Load repo-root `.env` when present (local dev). */
const repoRootEnv = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../../../.env",
);

if (existsSync(repoRootEnv)) {
  config({ path: repoRootEnv });
}
