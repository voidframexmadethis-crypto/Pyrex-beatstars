export type UserRole = 'ADMIN' | 'PRODUCER' | 'ARTIST' | 'GUEST';

const rolePermissions: Record<UserRole, string[]> = {
  ADMIN: ['edit_code', 'upload_beats', 'delete_beats', 'view_audit_logs', 'manage_users'],
  PRODUCER: ['upload_beats', 'edit_own_beats', 'download_stems'],
  ARTIST: ['stream_audio', 'download_tagged_free', 'purchase_license'],
  GUEST: ['stream_audio']
};

export function checkPermission(role: UserRole, requiredPermission: string): boolean {
  const permissions = rolePermissions[role] || [];
  return permissions.includes(requiredPermission);
}

export function enforceAccess(role: UserRole, permission: string) {
  if (!checkPermission(role, permission)) {
    throw new Error(`Access Denied: Role '${role}' lacks permission '${permission}'.`);
  }
}
