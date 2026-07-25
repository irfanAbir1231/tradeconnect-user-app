import { config as loadDotEnv } from "dotenv";
import { defineConfig } from "prisma/config";

// Prisma CLI does not load Next.js environment files automatically. Local values
// are loaded for CLI operations, while the application runtime uses Next.js.
loadDotEnv({ path: ".env.local" });
loadDotEnv({ path: ".env" });

const command = process.argv.slice(2).join(" ");
const needsDirectUrl = /(^|\s)(migrate|introspect)(\s|$)/.test(command)
  || /(^|\s)db\s+(pull|push|execute)(\s|$)/.test(command);
// Local development keeps DIRECT_URL in .env.local. Vercel's Neon integration
// exposes the equivalent direct connection as DATABASE_URL_UNPOOLED.
const migrationUrl = process.env.DIRECT_URL || process.env.DATABASE_URL_UNPOOLED;

if (needsDirectUrl && !migrationUrl) {
  throw new Error(
    "Prisma migration and schema operations require DIRECT_URL or DATABASE_URL_UNPOOLED. Configure DIRECT_URL locally or DATABASE_URL_UNPOOLED on Vercel.",
  );
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: migrationUrl ? { url: migrationUrl } : undefined,
});
