import { Component, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-trending-bundles',
  templateUrl: './trending-bundles.component.html',
  styleUrls: ['./trending-bundles.component.scss']
})
export class TrendingBundlesComponent implements OnInit {
  
  @Output("productCartInformation") productCartInformation: any = {
    
  };

  constructor(
  ) { }

  ngOnInit(): void {
  }

}
