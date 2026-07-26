import { requireCurrentActor } from "@/src/server/auth/require-permission";
import { AppError } from "@/src/server/errors/app-error";
import { apiSuccess } from "@/src/server/http/api-response";
import { withApiHandler } from "@/src/server/http/route-handler";
import { setPrimaryCompanyForActor } from "@/src/server/services/company-service";
import { parseCompanyId } from "@/src/server/validators/company";

export const runtime = "nodejs";

export const POST = withApiHandler(async (_request, { requestContext, params }) => {
  const value = (await params).companyId;
  if (typeof value !== "string") throw AppError.invalidRequest("A company identifier is required.");
  const actor = await requireCurrentActor();
  const company = await setPrimaryCompanyForActor(actor, parseCompanyId(value), requestContext);
  return apiSuccess(company, requestContext);
});
