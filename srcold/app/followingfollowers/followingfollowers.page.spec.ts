import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FollowingfollowersPage } from './followingfollowers.page';

describe('FollowingfollowersPage', () => {
  let component: FollowingfollowersPage;
  let fixture: ComponentFixture<FollowingfollowersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FollowingfollowersPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FollowingfollowersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
