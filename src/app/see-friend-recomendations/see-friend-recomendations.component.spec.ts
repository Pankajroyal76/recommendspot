import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SeeFriendRecomendationsComponent } from './see-friend-recomendations.component';

describe('SeeFriendRecomendationsComponent', () => {
  let component: SeeFriendRecomendationsComponent;
  let fixture: ComponentFixture<SeeFriendRecomendationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeeFriendRecomendationsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SeeFriendRecomendationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
