import "server-only";

import { apiErrorResponse, safeErrorLog } from "@/src/server/errors/error-response";
import { logger } from "@/src/server/logging/logger";

import { createRequestContext, requestDurationMs, withRequestHeaders, type RequestContext } from "./request-context";

export interface RouteHandlerContext {
  requestContext: RequestContext;
}

type RouteHandler = (request: Request, context: RouteHandlerContext) => Response | Promise<Response>;

export function withApiHandler(handler: RouteHandler): (request: Request) => Promise<Response> {
  return async (request) => {
    const requestContext = createRequestContext(request);
    const context = { requestContext };

    try {
      const response = await handler(request, context);
      logger.info("api.request.completed", {
        requestId: requestContext.requestId,
        route: requestContext.route,
        method: requestContext.method,
        status: response.status,
        duration: requestDurationMs(requestContext),
      });
      return withRequestHeaders(response, requestContext);
    } catch (error) {
      logger.error("api.request.failed", {
        requestId: requestContext.requestId,
        route: requestContext.route,
        method: requestContext.method,
        duration: requestDurationMs(requestContext),
        error: safeErrorLog(error),
      });
      return apiErrorResponse(error, requestContext.requestId);
    }
  };
}
