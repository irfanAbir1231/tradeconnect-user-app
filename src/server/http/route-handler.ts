import "server-only";

import { apiErrorResponse, safeErrorLog } from "@/src/server/errors/error-response";
import { logger } from "@/src/server/logging/logger";

import { createRequestContext, requestDurationMs, withRequestHeaders, type RequestContext } from "./request-context";

export interface RouteHandlerContext {
  requestContext: RequestContext;
  params: Promise<Record<string, string | string[] | undefined>>;
}

type NextRouteContext = {
  params: Promise<Record<string, string | string[] | undefined>>;
};

type RouteHandler = (request: Request, context: RouteHandlerContext) => Response | Promise<Response>;

/**
 * Wraps App Router handlers with the canonical API envelope and logging. Dynamic
 * route parameters are passed through rather than inferred from request URLs.
 */
export function withApiHandler(handler: RouteHandler): (request: Request, routeContext?: NextRouteContext) => Promise<Response> {
  return async (request, routeContext) => {
    const requestContext = createRequestContext(request);
    const context: RouteHandlerContext = {
      requestContext,
      params: routeContext?.params ?? Promise.resolve({}),
    };

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
