import { requireCurrentActor } from "@/src/server/auth/require-permission";
import { AppError } from "@/src/server/errors/app-error";
import { apiSuccess } from "@/src/server/http/api-response";
import { readJsonBody } from "@/src/server/http/json-body";
import { withApiHandler } from "@/src/server/http/route-handler";
import { getCompanyForActor, updateCompanyForActor } from "@/src/server/services/company-service";
import { parseCompanyId, parseUpdateCompanyInput } from "@/src/server/validators/company";

export const runtime = "nodejs";

async function companyIdFromParams(params: Promise<Record<string, string | string[] | undefined>>) {
  const value = (await params).companyId;
  if (typeof value !== "string") throw AppError.invalidRequest("A company identifier is required.");
  return parseCompanyId(value);
}

export const GET = withApiHandler(async (_request, { requestContext, params }) => {
  const actor = await requireCurrentActor();
  const company = await getCompanyForActor(actor, await companyIdFromParams(params));
  return apiSuccess(company, requestContext);
});

/** Updates an owned or administered company draft with optimistic version checking. */
export const PATCH = withApiHandler(async (request, { requestContext, params }) => {
  const actor = await requireCurrentActor();
  const company = await updateCompanyForActor(actor, await companyIdFromParams(params), parseUpdateCompanyInput(await readJsonBody(request)), requestContext);
  return apiSuccess(company, requestContext);
});
