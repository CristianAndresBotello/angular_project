export interface SiteUserList {
  id: number;
  status: string;
  user: string;
  name: string;
  email: string;
  photo: JSON;
  created_at: string;
  updated_at: string;
  statusText?: string;
}

export interface UrlParameters {
  page: string;
  limit: string;
  order: string;
  fields: string;
  filter: string;
}

export enum UserStatus {
  active = 1,
  inactive = 2,
  deleted = 3,
}

export interface SiteUser {
  id: number;
  status: number;
  user: string;
  password: string;
  name: string;
  email: string;
  gender: string;
  photo?: string;
  address: Address[];
}

export interface Address {
  id: number;
  status: string;
  title: string;
  name: string;
  telephone: string;
  fax: string;
  street: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  type: string;
  action: string;
  default: boolean;
}

export interface StatusOption {
  value: string;
  key: number;
}

export type FormType = "edit" | "new" | "";
