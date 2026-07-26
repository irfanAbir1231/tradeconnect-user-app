import { apiSuccess } from "@/src/server/http/api-response";
import { withApiHandler } from "@/src/server/http/route-handler";
import { listUpazilas } from "@/src/server/services/reference-data-service";
import { parseReferenceId } from "@/src/server/validators/reference-data";

export const runtime = "nodejs";
export const GET = withApiHandler(async (request, { requestContext }) => apiSuccess(await listUpazilas(parseReferenceId(new URL(request.url).searchParams.get("districtId"), "districtId")), requestContext, undefined, "public, max-age=300, s-maxage=3600"));
