import "server-only";

const requestIdHeader = "x-request-id";
const requestIdPattern = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;

export interface RequestContext {
  requestId: string;
  method: string;
  route: string;
  startedAt: number;
}

function isSafeRequestId(value: string | null): value is string {
  return value !== null && requestIdPattern.test(value);
}

export function createRequestContext(request: Request): RequestContext {
  const incomingId = request.headers.get(requestIdHeader);

  return {
    requestId: isSafeRequestId(incomingId) ? incomingId : crypto.randomUUID(),
    method: request.method,
    route: new URL(request.url).pathname,
    startedAt: Date.now(),
  };
}

export function withRequestHeaders(response: Response, context: RequestContext) {
  const headers = new Headers(response.headers);
  headers.set("X-Request-ID", context.requestId);
  headers.set("X-Response-Timestamp", new Date().toISOString());
  if (!headers.has("Cache-Control")) {
    headers.set("Cache-Control", "no-store");
  }

  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

export function requestDurationMs(context: RequestContext) {
  return Date.now() - context.startedAt;
}
