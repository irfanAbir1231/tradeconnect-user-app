import { apiSuccess } from "@/src/server/http/api-response";
import { withApiHandler } from "@/src/server/http/route-handler";
import { requireCurrentActor } from "@/src/server/auth/require-permission";

export const runtime = "nodejs";

/** Returns the authenticated user's safe actor profile; never include sessions or credentials. */
export const GET = withApiHandler(async (_request, { requestContext }) => {
  const actor = await requireCurrentActor();

  return apiSuccess(
    {
      id: actor.id,
      name: actor.fullName,
      email: actor.email,
      emailVerified: actor.emailVerified,
      roles: actor.roles,
      permissions: actor.permissions,
      companyMemberships: actor.companyMemberships,
    },
    requestContext,
  );
});
