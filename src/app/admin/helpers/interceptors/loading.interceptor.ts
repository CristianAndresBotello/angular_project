import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoadingService } from '../../service/loading/loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private requests: HttpRequest<any>[] = [];

  constructor(private loadingService: LoadingService) {}

  removeRequest(req: HttpRequest<any>) {
    const i = this.requests.indexOf(req);
    if (i >= 0) {
      this.requests.splice(i, 1);
    }
    this.loadingService.isLoading.next(this.requests.length > 0);
  }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    this.requests.push(request);

    this.loadingService.isLoading.next(true);
    return new Observable((observer) => {
      const subscription = next.handle(request).subscribe({
        next: (event) => {
          if (event instanceof HttpResponse) {
            this.removeRequest(request);
            observer.next(event);
          }
        },
        error: (err) => {
          this.removeRequest(request);
          observer.error(err);
        },
        complete: () => {
          this.removeRequest(request);
          observer.complete();
        },
      });

      // remove request from queue when cancelled
      return () => {
        this.removeRequest(request);
        subscription.unsubscribe();
      };
    });
  }
}
