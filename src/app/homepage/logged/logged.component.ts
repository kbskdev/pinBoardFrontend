import {Component, EventEmitter, OnInit, Output} from '@angular/core';
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
  userId:string = localStorage.getItem('userId')!

  public:boolean
  compName:string

  ngOnInit(): void {
    this.api.getCompList().subscribe(data=>{

      this.compositions = data.data.composition
      console.log(this.compositions)
    })
  }

  logout(){
    localStorage.clear()
    this.loggedCheck.emit()
  }

  @Output()
  loggedCheck = new EventEmitter<string>()

  goToComp(id:string){
    this.router.navigate(['board'],{queryParams:{id:`${id}`,userId:this.userId}})
  }

  addComp(){
    this.api.addComposition(this.compName,this.public).subscribe(data=>{
      this.compositions.push(data.compBody)
    })
  }

}
