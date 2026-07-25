import { NextResponse } from "next/server";

import { serverEnv } from "@/src/server/config/env";

import { AppError, isAppError } from "./app-error";
import { apiErrorStatuses, type ApiErrorCode } from "./error-codes";

export interface ApiErrorBody {
  error: {
    code: ApiErrorCode;
    message: string;
    fields?: Readonly<Record<string, string>>;
    requestId: string;
    retryAfterSeconds?: number;
  };
  meta: {
    requestId: string;
    timestamp: string;
  };
}

function normalizeError(error: unknown) {
  if (isAppError(error)) {
    return error;
  }

  return new AppError({
    code: "INTERNAL_ERROR",
    message: "Something went wrong while processing the request.",
    status: apiErrorStatuses.INTERNAL_ERROR,
    cause: error,
  });
}

export function apiErrorResponse(error: unknown, requestId: string) {
  const normalized = normalizeError(error);
  const timestamp = new Date().toISOString();
  const headers = new Headers({
    "Cache-Control": "no-store",
    "X-Request-ID": requestId,
    "X-Response-Timestamp": timestamp,
  });

  if (normalized.retryAfterSeconds !== undefined) {
    headers.set("Retry-After", String(normalized.retryAfterSeconds));
  }

  return NextResponse.json<ApiErrorBody>(
    {
      error: {
        code: normalized.code,
        message: normalized.message,
        ...(normalized.fields ? { fields: normalized.fields } : {}),
        requestId,
        ...(normalized.retryAfterSeconds !== undefined ? { retryAfterSeconds: normalized.retryAfterSeconds } : {}),
      },
      meta: { requestId, timestamp },
    },
    { status: normalized.status, headers },
  );
}

export function safeErrorLog(error: unknown) {
  if (isAppError(error)) {
    return { name: error.name, code: error.code, status: error.status, message: error.message };
  }

  return {
    name: error instanceof Error ? error.name : "UnknownError",
    message: error instanceof Error ? error.message : "Unknown error",
    ...(serverEnv.nodeEnv === "development" && error instanceof Error && error.stack ? { stack: error.stack } : {}),
  };
}
