import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FollowingfollowersPageRoutingModule } from './followingfollowers-routing.module';

import { FollowingfollowersPage } from './followingfollowers.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FollowingfollowersPageRoutingModule
  ],
  declarations: [FollowingfollowersPage]
})
export class FollowingfollowersPageModule {}
