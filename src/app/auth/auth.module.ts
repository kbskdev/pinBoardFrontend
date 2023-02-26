import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import {FormsModule} from "@angular/forms";
import {MaterialModule} from "../material/material.module";
import { ShowPhotoDirective } from './login/show-photo.directive';




@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    ShowPhotoDirective
  ],
  exports: [
    LoginComponent
  ],
  imports: [
    CommonModule, FormsModule,MaterialModule
  ]
})
export class AuthModule { }
