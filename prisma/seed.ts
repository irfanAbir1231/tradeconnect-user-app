import { config as loadDotEnv } from "dotenv";

loadDotEnv({ path: ".env.local" });
loadDotEnv({ path: ".env" });

import { PrismaClient, Prisma } from "../src/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to seed the database.");
}

const adapter = new PrismaNeon({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter });

const permissions = [
  "submit_request",
  "view_own_requests",
  "manage_own_company",
  "submit_inquiry",
  "view_admin_dashboard",
  "manage_requests",
  "review_verifications",
  "moderate_marketplace",
  "manage_companies",
  "view_analytics",
  "manage_team",
  "manage_settings",
] as const;

const rolePermissions: Record<string, readonly string[]> = {
  guest: [],
  business_user: ["submit_request", "view_own_requests", "manage_own_company", "submit_inquiry"],
  verified_business: ["submit_request", "view_own_requests", "manage_own_company", "submit_inquiry"],
  team_member: ["view_admin_dashboard", "manage_requests", "review_verifications", "moderate_marketplace"],
  admin: [
    "view_admin_dashboard",
    "manage_requests",
    "review_verifications",
    "moderate_marketplace",
    "manage_companies",
    "view_analytics",
  ],
  super_admin: [...permissions],
};

const roles = [
  ["guest", "Guest"],
  ["business_user", "Business user"],
  ["verified_business", "Verified business"],
  ["team_member", "Team member"],
  ["admin", "Admin"],
  ["super_admin", "Super admin"],
] as const;

const categories = [
  ["trade", "agri-food", "Agri-food and ingredients", null],
  ["trade", "industrial-raw-materials", "Industrial raw materials", null],
  ["trade", "garments-textiles", "Garments and textiles", null],
  ["trade", "packaging", "Packaging materials", null],
  ["trade", "consumer-goods", "Consumer goods", null],
  ["trade", "logistics", "Logistics and freight", null],
  ["technology", "software-and-digital-services", "Software and digital services", null],
  ["technology", "pos-software", "POS Software", "software-and-digital-services"],
  ["technology", "inventory-management", "Inventory Management", "software-and-digital-services"],
  ["technology", "ecommerce-system", "E-commerce System", "software-and-digital-services"],
  ["technology", "custom-erp-crm", "Custom ERP/CRM", "software-and-digital-services"],
] as const;

const countries = [
  ["BD", "BGD", "Bangladesh"],
  ["CN", "CHN", "China"],
  ["IN", "IND", "India"],
  ["VN", "VNM", "Vietnam"],
  ["AE", "ARE", "United Arab Emirates"],
  ["DE", "DEU", "Germany"],
  ["NL", "NLD", "Netherlands"],
  ["SG", "SGP", "Singapore"],
] as const;

const products = [
  {
    slug: "pos-software",
    name: "POS Software",
    category: "pos-software",
    shortDescription: "A fast, multi-branch point-of-sale system for retailers and distributors.",
    problem: "Sales, returns, and branch performance are spread across disconnected tills and manual reports.",
    features: ["Sales and returns", "Multi-branch controls", "Barcode and receipt support", "Daily sales reporting"],
    targetUsers: ["Retail stores", "Multi-branch businesses", "Distributors"],
  },
  {
    slug: "inventory-management",
    name: "Inventory Management",
    category: "inventory-management",
    shortDescription: "Track stock movement, purchase orders, warehouses, and reorder levels.",
    problem: "Teams lose time and margin when stock levels and warehouse movement are hard to reconcile.",
    features: ["Warehouse transfers", "Low-stock alerts", "Supplier purchase orders", "Batch and expiry tracking"],
    targetUsers: ["Distributors", "Manufacturers", "Warehouse managers"],
  },
  {
    slug: "ecommerce-system",
    name: "E-commerce System",
    category: "ecommerce-system",
    shortDescription: "A connected online storefront with catalog, order, payment, and delivery workflows.",
    problem: "Online sales suffer when storefront, payment, fulfilment, and delivery updates do not work together.",
    features: ["Bangla and English catalog", "Checkout-ready workflows", "Order fulfilment dashboard", "Delivery integrations"],
    targetUsers: ["Retail brands", "Wholesale distributors", "Consumer product companies"],
  },
  {
    slug: "custom-erp-crm",
    name: "Custom ERP/CRM",
    category: "custom-erp-crm",
    shortDescription: "A tailored business system connecting sales, procurement, finance, and customer workflows.",
    problem: "Generic tools force growing businesses to work around their process instead of supporting it.",
    features: ["Workflow mapping", "Role-based access", "Custom approvals", "API and reporting support"],
    targetUsers: ["Growing SMEs", "Manufacturers", "Distribution groups"],
  },
] as const;

async function seedReferenceData() {
  const permissionRecords = new Map<string, { id: string }>();

  for (const slug of permissions) {
    const permission = await prisma.permission.upsert({
      where: { slug },
      update: { description: `TradeConnect capability: ${slug}` },
      create: { slug, description: `TradeConnect capability: ${slug}` },
      select: { id: true },
    });
    permissionRecords.set(slug, permission);
  }

  const roleRecords = new Map<string, { id: string }>();
  for (const [slug, name] of roles) {
    const role = await prisma.role.upsert({
      where: { slug },
      update: { name, isSystem: true },
      create: { slug, name, isSystem: true },
      select: { id: true },
    });
    roleRecords.set(slug, role);
  }

  for (const [roleSlug, rolePermissionSlugs] of Object.entries(rolePermissions)) {
    const role = roleRecords.get(roleSlug);
    if (!role) continue;

    for (const permissionSlug of rolePermissionSlugs) {
      const permission = permissionRecords.get(permissionSlug);
      if (!permission) continue;

      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: role.id, permissionId: permission.id } },
        update: {},
        create: { roleId: role.id, permissionId: permission.id },
      });
    }
  }

  const categoryRecords = new Map<string, { id: string }>();
  for (const [scope, slug, name, parentSlug] of categories) {
    const parent = parentSlug ? categoryRecords.get(parentSlug) : undefined;
    const existing = await prisma.category.findFirst({ where: { scope, slug, deletedAt: null }, select: { id: true } });
    const category = existing ?? await prisma.category.create({
      data: { scope, slug, name, parentId: parent?.id, sortOrder: 0 },
      select: { id: true },
    });
    if (existing) {
      await prisma.category.update({ where: { id: existing.id }, data: { name, parentId: parent?.id, isActive: true } });
    }
    categoryRecords.set(slug, category);
  }

  const countryRecords = new Map<string, { id: string }>();
  for (const [iso2, iso3, name] of countries) {
    const country = await prisma.country.upsert({
      where: { iso2 },
      update: { iso3, name, isActive: true },
      create: { iso2, iso3, name },
      select: { id: true },
    });
    countryRecords.set(iso2, country);
  }

  const bangladesh = countryRecords.get("BD");
  if (!bangladesh) throw new Error("Bangladesh reference country could not be seeded.");

  for (const name of ["Dhaka", "Chattogram", "Gazipur", "Narayanganj", "Sylhet", "Khulna"]) {
    const existing = await prisma.location.findFirst({ where: { countryId: bangladesh.id, name, type: "city", parentId: null, deletedAt: null } });
    if (existing) {
      await prisma.location.update({ where: { id: existing.id }, data: { isActive: true } });
    } else {
      await prisma.location.create({ data: { countryId: bangladesh.id, name, type: "city" } });
    }
  }

  const provider = await prisma.company.upsert({
    where: { slug: "tradeconnect-demo-technology-provider" },
    update: { displayName: "TradeConnect Demo Technology Provider", accountStatus: "active", verificationStatus: "approved", isDemo: true },
    create: {
      slug: "tradeconnect-demo-technology-provider",
      legalName: "TradeConnect Demo Technology Provider",
      displayName: "TradeConnect Demo Technology Provider",
      businessType: "technology_provider",
      description: "A clearly marked development fixture used to anchor the seeded technology catalogue.",
      verificationStatus: "approved",
      isDemo: true,
    },
    select: { id: true },
  });

  for (const [index, product] of products.entries()) {
    const category = categoryRecords.get(product.category);
    if (!category) throw new Error(`Missing product category: ${product.category}`);

    await prisma.technologyProduct.upsert({
      where: { slug: product.slug },
      update: {
        providerCompanyId: provider.id,
        name: product.name,
        categoryId: category.id,
        shortDescription: product.shortDescription,
        description: product.shortDescription,
        problem: product.problem,
        features: product.features as unknown as Prisma.InputJsonValue,
        targetUsers: product.targetUsers as unknown as Prisma.InputJsonValue,
        useCases: [] as unknown as Prisma.InputJsonValue,
        implementationSteps: [] as unknown as Prisma.InputJsonValue,
        faq: [] as unknown as Prisma.InputJsonValue,
        pricingNote: "Custom pricing based on business needs",
        status: "published",
      },
      create: {
        slug: product.slug,
        providerCompanyId: provider.id,
        name: product.name,
        categoryId: category.id,
        shortDescription: product.shortDescription,
        description: product.shortDescription,
        problem: product.problem,
        features: product.features as unknown as Prisma.InputJsonValue,
        targetUsers: product.targetUsers as unknown as Prisma.InputJsonValue,
        useCases: [] as unknown as Prisma.InputJsonValue,
        implementationSteps: [] as unknown as Prisma.InputJsonValue,
        faq: [] as unknown as Prisma.InputJsonValue,
        pricingNote: "Custom pricing based on business needs",
        status: "published",
      },
    });

    if (index === products.length - 1) {
      console.info("Technology catalogue reference seed complete.");
    }
  }

  return {
    roles: roles.length,
    permissions: permissions.length,
    categories: categories.length,
    countries: countries.length,
    bangladeshLocations: 6,
    technologyProducts: products.length,
  };
}

async function seedOptionalDemoData() {
  if (process.env.SEED_DEMO_DATA !== "true") {
    return { enabled: false, records: 0 };
  }

  // Deliberately no users, passwords, contact details, documents, or credentials.
  await prisma.company.update({
    where: { slug: "tradeconnect-demo-technology-provider" },
    data: { description: "Development-only demo company; not a real business or contact.", isDemo: true },
  });
  return { enabled: true, records: 1 };
}

async function main() {
  const reference = await seedReferenceData();
  const demo = await seedOptionalDemoData();
  console.info("TradeConnect database seed complete.", { reference, demo });
}

function safeErrorSummary(error: unknown) {
  if (!error || typeof error !== "object") {
    return { name: typeof error };
  }

  const candidate = error as { name?: unknown; code?: unknown };
  return {
    name: typeof candidate.name === "string" ? candidate.name : "UnknownError",
    ...(typeof candidate.code === "string" ? { code: candidate.code } : {}),
  };
}

main()
  .catch((error: unknown) => {
    console.error("TradeConnect database seed failed.", safeErrorSummary(error));
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
