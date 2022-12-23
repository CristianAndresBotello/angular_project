import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLikeComponent } from './view-like.component';

describe('ViewLikeComponent', () => {
  let component: ViewLikeComponent;
  let fixture: ComponentFixture<ViewLikeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewLikeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewLikeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
