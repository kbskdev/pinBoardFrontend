import { Component, OnInit } from '@angular/core';
import {HttpService} from "../../service/http.service";
import {Composition} from "../../models/composition";
import {Router} from "@angular/router";

@Component({
  selector: 'app-logged',
  templateUrl: './logged.component.html',
  styleUrls: ['./logged.component.css']
})
export class LoggedComponent implements OnInit {

  constructor(private api:HttpService,private router:Router) { }

  compositions:Array<Composition>

  username:string = localStorage.getItem('user')!

  ngOnInit(): void {
    this.api.getCompList().subscribe(data=>{

      this.compositions = data.data.composition
      console.log(this.compositions)
    })
  }

  goToComp(id:string){
    this.router.navigate(['board'],{queryParams:{id:`${id}`}})
  }

}