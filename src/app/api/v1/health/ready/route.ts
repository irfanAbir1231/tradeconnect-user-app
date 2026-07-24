import { AppError } from "@/src/server/errors/app-error";
import { checkDatabaseHealth } from "@/src/server/db/health";
import { logger } from "@/src/server/logging/logger";
import { apiSuccess } from "@/src/server/http/api-response";
import { withApiHandler } from "@/src/server/http/route-handler";
import { serverEnv } from "@/src/server/config/env";

export const runtime = "nodejs";

export const GET = withApiHandler(async (_request, { requestContext }) => {
  try {
    await checkDatabaseHealth();
  } catch {
    // Keep readiness logs useful without copying provider or connection details.
    logger.warn("api.health.readiness.failed", {
      requestId: requestContext.requestId,
      reason: "database_unavailable",
    });
    throw AppError.serviceUnavailable();
  }

  return apiSuccess(
    {
      service: serverEnv.serviceName,
      status: "ready",
      database: "available",
    },
    requestContext,
  );
});
