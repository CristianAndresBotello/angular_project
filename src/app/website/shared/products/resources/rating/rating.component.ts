import { Component } from '@angular/core';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})

export class RatingComponent {
  
  public listStars = [
    {name: 'bad', description: '', value: 1},
    {name: 'regular', description: '', value: 2},
    {name: 'middle', description: '', value: 3},
    {name: 'good', description: '', value: 4},
    {name: 'success', description: '', value: 5},
  ]

  constructor( 
  ) { 
  }

  ngOnInit(): void {

  }
}
