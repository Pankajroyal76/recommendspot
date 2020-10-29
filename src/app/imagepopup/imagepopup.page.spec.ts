import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ImagepopupPage } from './imagepopup.page';

describe('ImagepopupPage', () => {
  let component: ImagepopupPage;
  let fixture: ComponentFixture<ImagepopupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImagepopupPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ImagepopupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
