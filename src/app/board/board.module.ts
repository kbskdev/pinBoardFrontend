import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhotoCanvasComponent } from './photo-canvas/photo-canvas.component';
import { BoardUiComponent } from './board-ui/board-ui.component';
import { BoardContainerComponent } from './board-container/board-container.component';



@NgModule({
  declarations: [
    PhotoCanvasComponent,
    BoardUiComponent,
    BoardContainerComponent
  ],
  exports: [
    PhotoCanvasComponent
  ],
  imports: [
    CommonModule
  ]
})
export class BoardModule { }
