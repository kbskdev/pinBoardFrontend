import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AuthService} from "../../service/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  constructor(private auth:AuthService) { }

  username:string = ''
  password:string = ''


  login(){
    this.auth.login(this.username,this.password).subscribe(data=>{
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
