export const ROLES = {
  USER: "user",
  DEVELOPER: "developer",
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

export function getUserRole(
  user: { user_metadata?: Record<string, unknown> } | null
): UserRole {
  if (!user) return ROLES.USER;
  return (user.user_metadata?.role as UserRole) || ROLES.USER;
}

export function isDeveloper(role: UserRole): boolean {
  return role === ROLES.DEVELOPER;
}
