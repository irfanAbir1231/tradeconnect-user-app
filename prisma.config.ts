import { config as loadDotEnv } from "dotenv";
import { defineConfig } from "prisma/config";

// Prisma CLI does not load Next.js environment files automatically. Local values
// are loaded for CLI operations, while the application runtime uses Next.js.
loadDotEnv({ path: ".env.local" });
loadDotEnv({ path: ".env" });

const command = process.argv.slice(2).join(" ");
const needsDirectUrl = /(^|\s)(migrate|introspect)(\s|$)/.test(command)
  || /(^|\s)db\s+(pull|push|execute)(\s|$)/.test(command);
const directUrl = process.env.DIRECT_URL;

if (needsDirectUrl && !directUrl) {
  throw new Error(
    "DIRECT_URL is required for Prisma migration and schema operations. Configure it in .env.local or the process environment.",
  );
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: directUrl ? { url: directUrl } : undefined,
});
