import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AuthService} from "../../service/auth.service";
import {User} from "../../models/user";
import {HttpService} from "../../service/http.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  constructor(private auth:AuthService,private api:HttpService) { }

  email:string = ''
  password:string = ''


  login(){
    this.auth.login(this.email,this.password).subscribe(data=>{
      localStorage.setItem('token',data.token)
      localStorage.setItem('user',data.data.username)
      this.loggedCheck.emit()
    })
  }

  @Output()
  loggedCheck = new EventEmitter<string>()

  ngOnInit(): void {
  }
}
