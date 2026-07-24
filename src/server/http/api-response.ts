import { NextResponse } from "next/server";

import type { RequestContext } from "./request-context";

export interface ApiMeta {
  requestId: string;
  timestamp: string;
  page?: number;
  pageSize?: number;
  total?: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

export interface ApiSuccessBody<T> {
  data: T;
  meta: ApiMeta;
}

function responseHeaders(context: RequestContext, cacheControl = "no-store") {
  return new Headers({
    "Cache-Control": cacheControl,
    "Content-Type": "application/json; charset=utf-8",
    "X-Request-ID": context.requestId,
  });
}

function mergeResponseHeaders(context: RequestContext, init: ResponseInit | undefined, cacheControl: string) {
  const headers = responseHeaders(context, cacheControl);

  if (init?.headers) {
    new Headers(init.headers).forEach((value, key) => headers.set(key, value));
  }

  return headers;
}

export function apiSuccess<T>(data: T, context: RequestContext, init?: ResponseInit, cacheControl = "no-store") {
  const timestamp = new Date().toISOString();

  return NextResponse.json<ApiSuccessBody<T>>(
    { data, meta: { requestId: context.requestId, timestamp } },
    { ...init, headers: mergeResponseHeaders(context, init, cacheControl) },
  );
}

export function apiCreated<T>(data: T, context: RequestContext) {
  return apiSuccess(data, context, { status: 201 });
}

export function apiNoContent(context: RequestContext) {
  return new Response(null, { status: 204, headers: responseHeaders(context) });
}

export function apiPaginated<T>(data: T, pagination: Omit<ApiMeta, "requestId" | "timestamp">, context: RequestContext, cacheControl = "no-store") {
  const timestamp = new Date().toISOString();

  return NextResponse.json<ApiSuccessBody<T>>(
    { data, meta: { ...pagination, requestId: context.requestId, timestamp } },
    { headers: mergeResponseHeaders(context, undefined, cacheControl) },
  );
}
