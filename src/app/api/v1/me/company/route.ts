import { requireCurrentActor } from "@/src/server/auth/require-permission";
import { apiSuccess } from "@/src/server/http/api-response";
import { withApiHandler } from "@/src/server/http/route-handler";
import { getPrimaryCompanyForActor } from "@/src/server/services/company-service";

export const runtime = "nodejs";

/** Returns the caller's selected primary company, or null when they have none. */
export const GET = withApiHandler(async (_request, { requestContext }) => {
  const actor = await requireCurrentActor();
  return apiSuccess(await getPrimaryCompanyForActor(actor), requestContext);
});
