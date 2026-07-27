import { requireCurrentActor } from "@/src/server/auth/require-permission";
import { apiCreated, apiPaginated } from "@/src/server/http/api-response";
import { readJsonBody } from "@/src/server/http/json-body";
import { withApiHandler } from "@/src/server/http/route-handler";
import { createBusinessRequestDraft, listBusinessRequestsForActor } from "@/src/server/services/business-request-service";
import { parseBusinessRequestListInput, parseCreateBusinessRequestInput } from "@/src/server/validators/business-request";

export const runtime = "nodejs";

/** Creates a draft request in the caller's selected primary company. */
export const POST = withApiHandler(async (request, { requestContext }) => {
  const actor = await requireCurrentActor();
  const created = await createBusinessRequestDraft(actor, parseCreateBusinessRequestInput(await readJsonBody(request)), requestContext);
  return apiCreated(created, requestContext);
});

/** Lists only the caller's selected primary-company requests. */
export const GET = withApiHandler(async (request, { requestContext }) => {
  const actor = await requireCurrentActor();
  const result = await listBusinessRequestsForActor(actor, parseBusinessRequestListInput(new URL(request.url).searchParams));
  return apiPaginated(result.data, result.pagination, requestContext);
});
