import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ContainerComponent} from "./homepage/container/container.component";
import {PhotoCanvasComponent} from "./board/photo-canvas/photo-canvas.component";

const routes: Routes = [
  { path: '', component:  ContainerComponent},
  { path:'board',component:PhotoCanvasComponent}
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes,{ useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
