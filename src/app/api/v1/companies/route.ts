import { requireCurrentActor } from "@/src/server/auth/require-permission";
import { apiCreated, apiSuccess } from "@/src/server/http/api-response";
import { readJsonBody } from "@/src/server/http/json-body";
import { withApiHandler } from "@/src/server/http/route-handler";
import { createCompanyForActor, listCompaniesForActor } from "@/src/server/services/company-service";
import { parseCreateCompanyInput } from "@/src/server/validators/company";

export const runtime = "nodejs";

/** Creates a draft business company for the authenticated owner. */
export const POST = withApiHandler(async (request, { requestContext }) => {
  const actor = await requireCurrentActor();
  const company = await createCompanyForActor(actor, parseCreateCompanyInput(await readJsonBody(request)), requestContext);
  return apiCreated(company, requestContext);
});

/** Lists only the authenticated user's active company memberships. */
export const GET = withApiHandler(async (_request, { requestContext }) => {
  const actor = await requireCurrentActor();
  return apiSuccess(await listCompaniesForActor(actor), requestContext);
});
