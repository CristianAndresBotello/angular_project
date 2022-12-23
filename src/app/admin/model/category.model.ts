export interface CategoryList {
  id: number;
  status: string;
  name: string;
  title: string;
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

interface CategoryOption {
  id: number;
  name: string;
  status: number;
  options: string;
}

export interface Category {
  id: number;
  status: number;
  name: string;
  description: string;
  price: number;
  images: [];
  url: string;
  tags: string;
  userId: number;
  categoryId: number;
  productCategoryId: number;
}

export interface SelectOption {
  key: number | string;
  value: string;
}

export type FormType = "edit" | "new" | "";
