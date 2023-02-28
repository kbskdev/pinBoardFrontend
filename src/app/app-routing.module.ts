import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PhotoCanvasComponent} from "./board/photo-canvas/photo-canvas.component";
import {ContainerComponent} from "./homepage/container/container.component";

const routes: Routes = [
  { path: '', component:  ContainerComponent},
  { path:'board',component:PhotoCanvasComponent}
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
