import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddlocalrecommendationPage } from './addlocalrecommendation.page';

describe('AddlocalrecommendationPage', () => {
  let component: AddlocalrecommendationPage;
  let fixture: ComponentFixture<AddlocalrecommendationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddlocalrecommendationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddlocalrecommendationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
