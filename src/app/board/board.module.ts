import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhotoCanvasComponent } from './photo-canvas/photo-canvas.component';
import {MaterialModule} from "../material/material.module";
import {FormsModule} from "@angular/forms";
import {MatFileUploadModule} from "angular-material-fileupload";
import { DragndropDirective } from './dragndrop.directive';
import { FullImageComponent } from './full-image/full-image.component';
import {MatCheckboxModule} from "@angular/material/checkbox";



@NgModule({
  declarations: [
    PhotoCanvasComponent,
    DragndropDirective,
    FullImageComponent
  ],
  exports: [
    PhotoCanvasComponent
  ],
    imports: [
        CommonModule, MaterialModule, FormsModule, MatFileUploadModule, MatCheckboxModule
    ]
})
export class BoardModule { }
