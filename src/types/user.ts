export type AdminRole = "admin" | "user";

export interface AdminUser {
  id: string;
  first_name: string;
  last_name: string;
  role: AdminRole;
}
