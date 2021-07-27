import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddRecommendPage } from './add-recommend.page';

describe('AddRecommendPage', () => {
  let component: AddRecommendPage;
  let fixture: ComponentFixture<AddRecommendPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRecommendPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddRecommendPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
