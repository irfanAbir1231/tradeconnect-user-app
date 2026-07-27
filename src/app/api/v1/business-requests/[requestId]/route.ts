import { requireCurrentActor } from "@/src/server/auth/require-permission";
import { AppError } from "@/src/server/errors/app-error";
import { apiNoContent, apiSuccess } from "@/src/server/http/api-response";
import { readJsonBody } from "@/src/server/http/json-body";
import { withApiHandler } from "@/src/server/http/route-handler";
import { deleteBusinessRequestDraft, getBusinessRequestForActor, updateBusinessRequestDraft } from "@/src/server/services/business-request-service";
import { parseBusinessRequestId, parseBusinessRequestVersionInput, parseUpdateBusinessRequestInput } from "@/src/server/validators/business-request";

export const runtime = "nodejs";

async function requestIdFromParams(params: Promise<Record<string, string | string[] | undefined>>) {
  const value = (await params).requestId;
  if (typeof value !== "string") throw AppError.invalidRequest("A request identifier is required.");
  return parseBusinessRequestId(value);
}

export const GET = withApiHandler(async (_request, { requestContext, params }) => {
  const actor = await requireCurrentActor();
  return apiSuccess(await getBusinessRequestForActor(actor, await requestIdFromParams(params)), requestContext);
});

/** Saves an owned draft with optimistic version checking. */
export const PATCH = withApiHandler(async (request, { requestContext, params }) => {
  const actor = await requireCurrentActor();
  const updated = await updateBusinessRequestDraft(actor, await requestIdFromParams(params), parseUpdateBusinessRequestInput(await readJsonBody(request)), requestContext);
  return apiSuccess(updated, requestContext);
});

/** Soft-deletes an owned draft; submitted and reviewed requests are preserved. */
export const DELETE = withApiHandler(async (request, { requestContext, params }) => {
  const actor = await requireCurrentActor();
  await deleteBusinessRequestDraft(actor, await requestIdFromParams(params), parseBusinessRequestVersionInput(await readJsonBody(request)), requestContext);
  return apiNoContent(requestContext);
});
