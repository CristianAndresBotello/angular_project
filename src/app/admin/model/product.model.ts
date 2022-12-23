export interface ProductList {
  id: number;
  status: string;
  name: string;
  price: number;
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

export enum ProductStatus {
  active = 1,
  inactive = 2,
  deleted = 3,
}

interface ProductOption {
  id: number;
  name: string;
  status: number;
  options: string;
}

export interface Product {
  id: number;
  status: number;
  name: string;
  description: string;
  price: number;
  images: [];
  url: string;
  tags: string;
  user: { id: number };
  category: { id: number };
  productCategory: { id: number };
  productCategoryOptions: [];
  productCategoryOptionsValue: {};
}

export interface SelectOption {
  key: number | string;
  value: string;
}

export type FormType = "edit" | "new" | "";

export interface Tag {
  id: number;
  name: string;
  action: string;
}

export interface ProductImage {
  uid: string;
  index: number;
  primary: Boolean;
  srd?: string;
  file?: Object;
  action?: string;
}
