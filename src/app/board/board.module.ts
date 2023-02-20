import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhotoCanvasComponent } from './photo-canvas/photo-canvas.component';



@NgModule({
  declarations: [
    PhotoCanvasComponent
  ],
  exports: [
    PhotoCanvasComponent
  ],
  imports: [
    CommonModule
  ]
})
export class BoardModule { }
