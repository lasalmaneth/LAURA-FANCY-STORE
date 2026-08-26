export const ALLOWED_ADMIN_EMAILS = [
  "lasaljayasinghe331@gmail.com",
];

export function isAuthorizedAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return ALLOWED_ADMIN_EMAILS.some((e) => e.toLowerCase() === email.toLowerCase());
}

export function isUserAdmin(user: any): boolean {
  if (!user || !user.email) return false;
  return (
    isAuthorizedAdminEmail(user.email) ||
    user.app_metadata?.role === "admin" ||
    user.user_metadata?.role === "admin"
  );
}
