export interface ProductCategoryList {
  id: number;
  status: string;
  name: string;
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

export enum CategoryStatus {
  active = 1,
  inactive = 2,
  deleted = 3,
}

interface ProductCategoryOption {
  id: number;
  name: string;
  status: number;
  options: string;
}

export interface ProductCategory {
  id: number;
  status: number;
  name: string;
  options: ProductCategoryOption[];
}

export interface SelectOption {
  key: number | string;
  value: string;
}

export type FormType = "edit" | "new" | "";
