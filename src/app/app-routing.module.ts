import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ContainerComponent} from "./homepage/container/container.component";
import {BoardContainerComponent} from "./board/board-container/board-container.component";

const routes: Routes = [
  { path: '', component:  ContainerComponent},
  { path:'board',component:BoardContainerComponent}
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
