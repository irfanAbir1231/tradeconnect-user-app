import "server-only";

import { headers } from "next/headers";

import { auth } from "./config";

/** Reads and verifies the session on the server; never trust client-supplied user ids. */
export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}
