import type { ApiErrorCode } from "./error-codes";
import { apiErrorStatuses } from "./error-codes";

export type FieldErrors = Readonly<Record<string, string>>;

export class AppError extends Error {
  readonly code: ApiErrorCode;
  readonly status: number;
  readonly fields?: FieldErrors;
  readonly retryAfterSeconds?: number;

  constructor({ code, message, status, fields, retryAfterSeconds, cause }: { code: ApiErrorCode; message: string; status: number; fields?: FieldErrors; retryAfterSeconds?: number; cause?: unknown }) {
    super(message, { cause });
    this.name = "AppError";
    this.code = code;
    this.status = status;
    this.fields = fields;
    this.retryAfterSeconds = retryAfterSeconds;
  }

  static invalidRequest(message = "The request is invalid.", fields?: FieldErrors) {
    return new AppError({ code: "INVALID_REQUEST", message, status: apiErrorStatuses.INVALID_REQUEST, fields });
  }

  static validation(message = "Please correct the highlighted fields.", fields?: FieldErrors) {
    return new AppError({ code: "VALIDATION_ERROR", message, status: apiErrorStatuses.VALIDATION_ERROR, fields });
  }

  static unauthenticated(message = "Authentication is required.") {
    return new AppError({ code: "UNAUTHENTICATED", message, status: apiErrorStatuses.UNAUTHENTICATED });
  }

  static forbidden(message = "You do not have permission to perform this action.") {
    return new AppError({ code: "FORBIDDEN", message, status: apiErrorStatuses.FORBIDDEN });
  }

  static notFound(message = "The requested resource was not found.") {
    return new AppError({ code: "NOT_FOUND", message, status: apiErrorStatuses.NOT_FOUND });
  }

  static conflict(message = "The resource was changed by another request.") {
    return new AppError({ code: "CONFLICT", message, status: apiErrorStatuses.CONFLICT });
  }

  static companyVersionConflict() {
    return new AppError({ code: "COMPANY_VERSION_CONFLICT", message: "This company profile changed. Refresh and review the saved details before trying again.", status: apiErrorStatuses.COMPANY_VERSION_CONFLICT });
  }

  static companyRegistrationConflict() {
    return new AppError({ code: "COMPANY_REGISTRATION_CONFLICT", message: "One of the registration identifiers cannot be used for this company profile.", status: apiErrorStatuses.COMPANY_REGISTRATION_CONFLICT });
  }

  static invalidState(message = "The requested state change is not allowed.") {
    return new AppError({ code: "INVALID_STATE_TRANSITION", message, status: apiErrorStatuses.INVALID_STATE_TRANSITION });
  }

  static payloadTooLarge(message = "The request payload is too large.") {
    return new AppError({ code: "PAYLOAD_TOO_LARGE", message, status: apiErrorStatuses.PAYLOAD_TOO_LARGE });
  }

  static unsupportedMediaType(message = "The media type is not supported.") {
    return new AppError({ code: "UNSUPPORTED_MEDIA_TYPE", message, status: apiErrorStatuses.UNSUPPORTED_MEDIA_TYPE });
  }

  static rateLimited(message = "Too many requests. Please try again later.", retryAfterSeconds = 60) {
    return new AppError({ code: "RATE_LIMITED", message, status: apiErrorStatuses.RATE_LIMITED, retryAfterSeconds });
  }

  static serviceUnavailable(message = "The service is temporarily unavailable.") {
    return new AppError({ code: "SERVICE_UNAVAILABLE", message, status: apiErrorStatuses.SERVICE_UNAVAILABLE });
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
