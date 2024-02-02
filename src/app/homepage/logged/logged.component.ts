import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {HttpService} from "../../service/http.service";
import {Composition} from "../../models/composition";
import {Router} from "@angular/router";
import {FullPublicCompList} from "../../models/full-public-comp-list";
import {PublicComposition} from "../../models/public-composition";
import {stringify} from "querystring";

@Component({
  selector: 'app-logged',
  templateUrl: './logged.component.html',
  styleUrls: ['./logged.component.css']
})
export class LoggedComponent implements OnInit {

  constructor(private api:HttpService,private router:Router) { }

  boards:Array<Composition>
  publicBoards:Array<PublicComposition>

  username:string = localStorage.getItem('user')!
  userId:string = localStorage.getItem('userId')!

  public:boolean
  compName:string

  ngOnInit(): void {
    this.api.getCompList().subscribe(data=>{
      this.boards = data.data.composition
      console.log(this.boards)
      console.log("_______________")
    })

    this.api.getFullPublicCompList().subscribe(data=>{
      this.publicBoards = data.data
      console.log(this.publicBoards)
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
      this.boards.push(data.compBody)
    })
  }

  protected readonly stringify = stringify;
}
