import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileSettingPageRoutingModule } from './profile-setting-routing.module';

import { ProfileSettingPage } from './profile-setting.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ProfileSettingPageRoutingModule
  ],
  declarations: [ProfileSettingPage]
})
export class ProfileSettingPageModule {}
