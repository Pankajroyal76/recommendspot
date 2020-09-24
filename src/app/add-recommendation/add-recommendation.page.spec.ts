import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddRecommendationPage } from './add-recommendation.page';

describe('AddRecommendationPage', () => {
  let component: AddRecommendationPage;
  let fixture: ComponentFixture<AddRecommendationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRecommendationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddRecommendationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
