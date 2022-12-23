export interface Toast {
  id: string;
  type: ToastType;
  class: string;
  header: string;
  message: string;
  autoClose: boolean;
  autoCloseTime: number;
  keepAfterRouteChange?: boolean;
}

export enum ToastType {
  Success,
  Error,
  Info,
  Warning,
}
