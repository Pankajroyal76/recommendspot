import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserProfilePageRoutingModule } from './user-profile-routing.module';

import { UserProfilePage } from './user-profile.page';
import { CommonPipeModule } from '../commonPipe.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserProfilePageRoutingModule,
    CommonPipeModule
  ],
  declarations: [UserProfilePage],
  exports: [CommonPipeModule]
})
export class UserProfilePageModule {}
