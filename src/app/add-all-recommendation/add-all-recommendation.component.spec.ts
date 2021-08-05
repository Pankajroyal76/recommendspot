import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAllRecommendationComponent } from './add-all-recommendation.component';

describe('AddAllRecommendationComponent', () => {
  let component: AddAllRecommendationComponent;
  let fixture: ComponentFixture<AddAllRecommendationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAllRecommendationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAllRecommendationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
