import { config as loadEnv } from "dotenv";
import { PrismaNeon } from "@prisma/adapter-neon";

import { PrismaClient } from "../src/generated/prisma/client";

const supportedRoles = ["business_user", "verified_business", "team_member", "admin", "super_admin"] as const;
type SupportedRole = (typeof supportedRoles)[number];

function argument(name: string) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function requireArgument(name: string) {
  const value = argument(name)?.trim();

  if (!value || value.startsWith("--")) {
    throw new Error(`Missing ${name}.`);
  }

  return value;
}

async function main() {
  loadEnv({ path: ".env.local" });
  loadEnv();

  if (process.env.NODE_ENV === "production") {
    throw new Error("This development role-grant CLI cannot run in production.");
  }

  const email = argument("--email")?.trim().toLowerCase();
  const userId = argument("--user-id")?.trim();
  const roleSlug = requireArgument("--role");

  if ((email ? 1 : 0) + (userId ? 1 : 0) !== 1) {
    throw new Error("Provide exactly one of --email or --user-id.");
  }

  if (!supportedRoles.includes(roleSlug as SupportedRole)) {
    throw new Error("--role must be one of the supported canonical roles.");
  }

  if ((roleSlug === "admin" || roleSlug === "super_admin") && argument("--confirm-admin") !== "I_UNDERSTAND") {
    throw new Error("Admin role grants require --confirm-admin I_UNDERSTAND.");
  }

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required for this development CLI.");
  }

  const prisma = new PrismaClient({ adapter: new PrismaNeon({ connectionString: databaseUrl }) });

  try {
    const user = await prisma.user.findFirst({
      where: email ? { email: { equals: email, mode: "insensitive" } } : { id: userId },
      select: { id: true },
    });
    const role = await prisma.role.findUnique({ where: { slug: roleSlug }, select: { id: true } });

    if (!user) {
      throw new Error("No matching user was found.");
    }

    if (!role) {
      throw new Error("The requested canonical role has not been seeded.");
    }

    const existing = await prisma.userRole.findFirst({
      where: { userId: user.id, roleId: role.id, companyId: null, revokedAt: null },
      select: { id: true },
    });

    if (existing) {
      console.info(`Role already active for user ${user.id}.`);
      return;
    }

    await prisma.$transaction(async (transaction) => {
      await transaction.userRole.create({ data: { userId: user.id, roleId: role.id } });
      await transaction.auditLog.create({
        data: {
          actorRole: "system",
          action: "auth.role_granted",
          resourceType: "user",
          resourceId: user.id,
          afterJson: { role: roleSlug, source: "development_cli" },
        },
      });
    });

    console.info(`Granted ${roleSlug} to user ${user.id}.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Role grant failed.";
  console.error(message);
  process.exitCode = 1;
});
