import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import {HttpClientModule} from "@angular/common/http";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import {HomepageModule} from "./homepage/homepage.module";
import {BoardModule} from "./board/board.module";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, HttpClientModule, BrowserAnimationsModule, AppRoutingModule, HomepageModule,BoardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
