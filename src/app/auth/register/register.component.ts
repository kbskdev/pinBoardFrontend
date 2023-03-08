import { Component, OnInit } from '@angular/core';
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
      localStorage.setItem('token',data.token)
      localStorage.setItem('user',data.data.username)
    })
  }

  ngOnInit(): void {
  }

}
