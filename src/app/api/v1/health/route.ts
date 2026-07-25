import { apiSuccess } from "@/src/server/http/api-response";
import { withApiHandler } from "@/src/server/http/route-handler";
import { serverEnv } from "@/src/server/config/env";

export const runtime = "nodejs";

export const GET = withApiHandler(async (_request, { requestContext }) => {
  return apiSuccess(
    {
      service: serverEnv.serviceName,
      status: "ok",
      environment: serverEnv.vercelEnv ?? serverEnv.nodeEnv,
      timestamp: new Date().toISOString(),
      version: serverEnv.version,
      liveness: true,
    },
    requestContext,
  );
});
