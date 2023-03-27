import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContainerComponent } from './container/container.component';
import { LoggedComponent } from './logged/logged.component';
import {AuthModule} from "../auth/auth.module";
import {MaterialModule} from "../material/material.module";
import {FormsModule} from "@angular/forms";
import {MatCheckboxModule} from "@angular/material/checkbox";



@NgModule({
  declarations: [
    ContainerComponent,
    LoggedComponent
  ],
    imports: [
        CommonModule, AuthModule, MaterialModule, FormsModule, MatCheckboxModule
    ]
})
export class HomepageModule { }
