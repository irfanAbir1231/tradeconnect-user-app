export const defaultBusinessUserRoleSlug = "business_user";

type EnsureSingleAssignmentOptions<TAssignment> = {
  findExisting: () => Promise<TAssignment | null>;
  create: () => Promise<TAssignment>;
};

/**
 * Keeps the default-role hook idempotent, including when concurrent signups
 * race on the database uniqueness constraint.
 */
export async function ensureSingleDefaultRoleAssignment<TAssignment>({
  findExisting,
  create,
}: EnsureSingleAssignmentOptions<TAssignment>) {
  const existing = await findExisting();

  if (existing) {
    return existing;
  }

  try {
    return await create();
  } catch (error) {
    const racedAssignment = await findExisting();

    if (racedAssignment) {
      return racedAssignment;
    }

    throw error;
  }
}
