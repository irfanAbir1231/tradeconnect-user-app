import { apiSuccess } from "@/src/server/http/api-response";
import { withApiHandler } from "@/src/server/http/route-handler";
import { listCountries } from "@/src/server/services/reference-data-service";

export const runtime = "nodejs";
export const GET = withApiHandler(async (_request, { requestContext }) => apiSuccess(await listCountries(), requestContext, undefined, "public, max-age=300, s-maxage=3600"));
