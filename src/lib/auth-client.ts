"use client";

import { createAuthClient } from "better-auth/react";

/** Browser client for the same-origin `/api/auth` Better Auth handler. */
export const authClient = createAuthClient();
