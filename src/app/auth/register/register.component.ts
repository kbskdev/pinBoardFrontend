import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AuthService} from "../../service/auth.service";
import {HttpService} from "../../service/http.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  constructor(private auth:AuthService) { }

  username:string = ''
  password:string = ''


  register(){
    this.auth.register(this.username,this.password).subscribe(data=>{
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
