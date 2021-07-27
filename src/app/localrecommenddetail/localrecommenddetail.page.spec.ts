import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LocalrecommenddetailPage } from './localrecommenddetail.page';

describe('LocalrecommenddetailPage', () => {
  let component: LocalrecommenddetailPage;
  let fixture: ComponentFixture<LocalrecommenddetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalrecommenddetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LocalrecommenddetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
