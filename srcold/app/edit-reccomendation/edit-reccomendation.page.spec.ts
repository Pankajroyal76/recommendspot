import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditReccomendationPage } from './edit-reccomendation.page';

describe('EditReccomendationPage', () => {
  let component: EditReccomendationPage;
  let fixture: ComponentFixture<EditReccomendationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditReccomendationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditReccomendationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
