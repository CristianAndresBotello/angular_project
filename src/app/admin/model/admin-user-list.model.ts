export interface AdminUserList {
  admuse_id: number;
  admuse_status: string;
  admuse_user: string;
  admuse_name: string;
  admuse_email: string;
  admuse_photo: JSON;
  admuse_created_at: string;
  admuse_updated_at: string;
  statusText?: string;
}

export interface UrlParameters {
  page: string;
  limit: string;
  order: string;
  fields: string;
  filter: string;
}

export enum AdminStatus {
  active = 1,
  inactive = 2,
  deleted = 3,
}

export interface AdminUser {
  admuse_id: number;
  admuse_status: number;
  admuse_user: string;
  admuse_password: string;
  admuse_name: string;
  admuse_email: string;
}

export interface StatusOption {
  value: string;
  key: number;
}

export type FormType = "edit" | "new" | "";
