import { Role } from "@prisma/client";

const roleLevels: Record<Role, number> = {
  STUDENT: 1,
  ORGANIZER: 2,
  ADMIN: 3,
};

export function hasRole(
  userRole: Role,
  requiredRole: Role
): boolean {
  return roleLevels[userRole] >= roleLevels[requiredRole];
}

export function canSubmitEvent(role: Role): boolean {
  return hasRole(role, Role.STUDENT);
}

export function canApproveEvent(role: Role): boolean {
  return hasRole(role, Role.ORGANIZER);
}

export function canManageUsers(role: Role): boolean {
  return hasRole(role, Role.ADMIN);
}

export function canAssignRoles(role: Role): boolean {
  return hasRole(role, Role.ADMIN);
}