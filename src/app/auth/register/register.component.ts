import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AuthService} from "../../service/auth.service";
import {catchError, throwError} from "rxjs";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  constructor(private auth:AuthService) { }

  username:string = ''
  password:string = ''
  registerError:string

  register(){
    this.auth.register(this.username,this.password).pipe(
      catchError(err=>{
        this.registerError = "there is already user with that nick"
        return throwError(err)})
    ).subscribe(data=>{
      localStorage.setItem('user',data.data.username)
      this.auth.login(this.username,this.password).subscribe(data=>{
        localStorage.setItem('token',data.token)
        this.loggedCheck.emit()
      })

    })
  }

  @Output()
  loggedCheck = new EventEmitter<string>()

  ngOnInit(): void {
  }

}
