import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhotoCanvasComponent } from './photo-canvas/photo-canvas.component';
import {MaterialModule} from "../material/material.module";
import {FormsModule} from "@angular/forms";
import {MatFileUploadModule} from "angular-material-fileupload";
import { DragndropDirective } from './dragndrop.directive';



@NgModule({
  declarations: [
    PhotoCanvasComponent,
    DragndropDirective
  ],
  exports: [
    PhotoCanvasComponent
  ],
  imports: [
    CommonModule,MaterialModule,FormsModule,MatFileUploadModule
  ]
})
export class BoardModule { }
