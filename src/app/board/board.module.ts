import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhotoCanvasComponent } from './photo-canvas/photo-canvas.component';
import { BoardUiComponent } from './board-ui/board-ui.component';
import { BoardContainerComponent } from './board-container/board-container.component';
import {MaterialModule} from "../material/material.module";
import {FormsModule} from "@angular/forms";
import {MatFileUploadModule} from "angular-material-fileupload";
import { DragndropDirective } from './dragndrop.directive';



@NgModule({
  declarations: [
    PhotoCanvasComponent,
    BoardUiComponent,
    BoardContainerComponent,
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
