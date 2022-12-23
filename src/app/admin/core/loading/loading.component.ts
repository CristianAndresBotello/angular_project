import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../../service/loading/loading.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements OnInit {
  public loading: boolean = false;

  constructor(private loadingService: LoadingService) {
    // Subscribe to the loading service
    this.loadingService.isLoading.subscribe((v) => (this.loading = v));
  }

  ngOnInit(): void {}
}
