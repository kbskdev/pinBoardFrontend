import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AuthService} from "../../service/auth.service";
import {catchError, throwError} from "rxjs";
import {HttpService} from "../../service/http.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  constructor(private auth:AuthService, private  api:HttpService) { }

  username:string = ''
  password:string = ''
  loginError:string
  isMobile:boolean = this.api.isMobile



  login(){
    this.auth.login(this.username,this.password).pipe(catchError(err => {
      this.loginError = "Wrong password or username"

      return throwError(err)}))
    .subscribe(data=>{
      localStorage.setItem('token',data.token)
      localStorage.setItem('user',data.data.username)
      localStorage.setItem('userId',data.data._id)
      this.loggedCheck.emit()
    })
  }

  @Output()
  loggedCheck = new EventEmitter<string>()

  ngOnInit(): void {
  }
}
