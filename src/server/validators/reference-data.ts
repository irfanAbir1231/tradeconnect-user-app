import "server-only";

import { AppError } from "@/src/server/errors/app-error";

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function parseReferenceId(value: string | null, field: string) {
  if (!value || !uuid.test(value)) throw AppError.validation("Please correct the highlighted fields.", { [field]: "Use a valid reference identifier." });
  return value;
}
