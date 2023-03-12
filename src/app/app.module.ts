import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import {HomepageModule} from "./homepage/homepage.module";
import {BoardModule} from "./board/board.module";
import {AuthInterceptor} from "./interceptors/auth.interceptor";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, HttpClientModule, BrowserAnimationsModule, AppRoutingModule, HomepageModule,BoardModule
  ],
  providers: [{provide:HTTP_INTERCEPTORS,useClass:AuthInterceptor,multi:true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
