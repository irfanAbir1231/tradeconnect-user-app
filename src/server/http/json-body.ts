import "server-only";

import { AppError } from "@/src/server/errors/app-error";

/** Parses a JSON request body without returning parser internals to API callers. */
export async function readJsonBody(request: Request): Promise<unknown> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    throw AppError.unsupportedMediaType("Use application/json for this request.");
  }
  try {
    return await request.json();
  } catch {
    throw AppError.invalidRequest("Send valid JSON.");
  }
}
