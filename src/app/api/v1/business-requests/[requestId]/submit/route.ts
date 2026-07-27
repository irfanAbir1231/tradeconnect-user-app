import { requireCurrentActor } from "@/src/server/auth/require-permission";
import { AppError } from "@/src/server/errors/app-error";
import { apiSuccess } from "@/src/server/http/api-response";
import { readJsonBody } from "@/src/server/http/json-body";
import { withApiHandler } from "@/src/server/http/route-handler";
import { submitBusinessRequestDraft } from "@/src/server/services/business-request-service";
import { parseBusinessRequestId, parseBusinessRequestVersionInput } from "@/src/server/validators/business-request";

export const runtime = "nodejs";

async function requestIdFromParams(params: Promise<Record<string, string | string[] | undefined>>) {
  const value = (await params).requestId;
  if (typeof value !== "string") throw AppError.invalidRequest("A request identifier is required.");
  return parseBusinessRequestId(value);
}

/** Submits an owned, complete draft for the later review workflow. */
export const POST = withApiHandler(async (request, { requestContext, params }) => {
  const actor = await requireCurrentActor();
  const submitted = await submitBusinessRequestDraft(actor, await requestIdFromParams(params), parseBusinessRequestVersionInput(await readJsonBody(request)), requestContext);
  return apiSuccess(submitted, requestContext);
});
