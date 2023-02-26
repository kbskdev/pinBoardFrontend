import { Component,OnInit } from '@angular/core';
import {HttpService} from "./service/http.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  constructor(private api:HttpService) {
  }
  ngOnInit() {
    console.log(this.isLogged)
    console.log(localStorage.getItem('user'))
  }
  image:any

  isLogged:boolean = localStorage.getItem('user') != ('' || undefined)



  title = 'pinboardfrontend';
}
