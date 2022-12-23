import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';
import { Toast, ToastType } from '../../model/toast.model';
import { ToastService } from '../../service/toast/toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent implements OnInit {
  @Input() id = 'default-toast';
  @Input() fade = true;

  toasts: Toast[] = [];
  toastSubscription!: Subscription;
  routeSubscription!: Subscription;

  constructor(private router: Router, private toastService: ToastService) {}

  ngOnInit(): void {
    // subscribe to new alert notifications
    this.toastSubscription = this.toastService
      .onToast(this.id)
      .subscribe((toast: Toast) => {
        // clear toasts when an empty toast is received
        if (!toast.message || toast.message == '') {
          // filter out toasts without 'keepAfterRouteChange' flag
          this.toasts = this.toasts.filter((x) => x.keepAfterRouteChange);

          // remove 'keepAfterRouteChange' flag on the rest
          this.toasts.forEach((x) => delete x.keepAfterRouteChange);
          return;
        }

        // add toast to array
        this.toasts.push(toast);

        // auto close toast if required
        if (toast.autoClose) {
          setTimeout(() => this.removeToast(toast), toast.autoCloseTime);
        }
      });

    // clear alerts on location change
    this.routeSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.toastService.clear(this.id);
      }
    });
  }

  ngOnDestroy() {
    // unsubscribe to avoid memory leaks
    this.toastSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
  }

  removeToast(toast: Toast) {
    // check if already removed to prevent error on auto close
    if (!this.toasts.includes(toast)) return;

    // remove toast
    this.toasts = this.toasts.filter((x) => x !== toast);
  }
}
