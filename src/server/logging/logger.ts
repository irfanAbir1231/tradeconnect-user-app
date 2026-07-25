import "server-only";

import { serverEnv } from "@/src/server/config/env";

type LogLevel = "debug" | "info" | "warn" | "error";
type LogValue = string | number | boolean | null | undefined | LogValue[] | { [key: string]: LogValue };
export type LogMeta = Readonly<Record<string, LogValue>>;

const sensitiveKeyPattern = /(password|cookie|authorization|access.?token|refresh.?token|reset.?token|secret|signature|storage.?key|document.?url|body)/i;

function redact(value: LogValue, depth = 0): LogValue {
  if (depth > 3 || value === null || value === undefined || typeof value !== "object") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => redact(item, depth + 1));
  }

  return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, sensitiveKeyPattern.test(key) ? "[REDACTED]" : redact(entry, depth + 1)]));
}

function write(level: LogLevel, event: string, meta: LogMeta = {}) {
  const safeMeta = redact(meta) as Record<string, LogValue>;
  const record = {
    timestamp: new Date().toISOString(),
    level,
    event,
    service: serverEnv.serviceName,
    ...safeMeta,
  };

  const line = JSON.stringify(record);

  if (level === "error") {
    console.error(line);
  } else if (level === "warn") {
    console.warn(line);
  } else if (level === "debug") {
    console.debug(line);
  } else {
    console.info(line);
  }
}

export const logger = {
  debug: (event: string, meta?: LogMeta) => write("debug", event, meta),
  info: (event: string, meta?: LogMeta) => write("info", event, meta),
  warn: (event: string, meta?: LogMeta) => write("warn", event, meta),
  error: (event: string, meta?: LogMeta) => write("error", event, meta),
};

/**
 * Redaction policy: never log credentials, cookies, tokens, signed URLs, raw
 * documents, or request bodies. Add explicit safe metadata instead.
 */
