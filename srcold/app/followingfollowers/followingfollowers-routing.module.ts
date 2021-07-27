import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FollowingfollowersPage } from './followingfollowers.page';

const routes: Routes = [
  {
    path: '',
    component: FollowingfollowersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FollowingfollowersPageRoutingModule {}
