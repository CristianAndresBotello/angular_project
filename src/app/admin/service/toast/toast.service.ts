import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Toast, ToastType } from '../../model/toast.model';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private subject = new Subject<Toast>();
  private defaultId = 'default-toast';
  private defaultOptions: Toast = {
    id: 'default-toast',
    type: 0,
    class: '',
    header: '',
    message: '',
    autoClose: true,
    autoCloseTime: 3000,
  };

  // enable subscribing to alerts observable
  onToast(id = this.defaultId): Observable<Toast> {
    // Return an observable filered by id
    return this.subject.asObservable().pipe(filter((x) => x && x.id === id));
  }

  // convenience methods
  success(message: string, options?: any) {
    options = options ? options : this.defaultOptions;

    this.toast({
      ...options,
      type: ToastType.Success,
      class: 'bg-success',
      header: 'Success',
      message,
    });
  }

  error(message: string, options?: any) {
    options = options ? options : this.defaultOptions;

    this.toast({
      ...options,
      type: ToastType.Error,
      class: 'bg-danger',
      header: 'Error',
      message,
    });
  }

  info(message: string, options?: any) {
    options = options ? options : this.defaultOptions;

    this.toast({
      ...options,
      type: ToastType.Info,
      class: 'bg-info',
      header: 'Information',
      message,
    });
  }

  warn(message: string, options?: any) {
    options = options ? options : this.defaultOptions;

    this.toast({
      ...options,
      type: ToastType.Warning,
      class: 'bg-warning',
      header: 'Warning',
      message,
    });
  }

  // main alert method
  toast(toast: Toast) {
    toast.id = toast.id || this.defaultId;
    this.subject.next(toast);
  }

  // clear alerts
  clear(id = this.defaultId) {
    this.subject.next({ ...this.defaultOptions, id });
    // this.subject.next(new Toast({ id }));
  }
}
