import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';
import { CommonPipeModule } from '../commonPipe.module';

import { ProfilePage } from './profile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommonPipeModule,
    ProfilePageRoutingModule
  ],
  declarations: [ProfilePage],
  exports: [CommonPipeModule]
})
export class ProfilePageModule {}
