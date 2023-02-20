import { Component, OnInit } from '@angular/core';
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

  userData:User

  login(){
    this.auth.login(this.email,this.password).subscribe(data=>{
      localStorage.setItem('token',data.token)
      localStorage.setItem('user',data.data.username)
      // this.common.isLogged=true
      // this.common.loggedUser=data.data.id
      // this.common.loggedUsername = data.data.username
    })
  }

  // showUserData(){
  //   return this.api.getCompList().subscribe(data=>{
  //     this.userData=data.data
  //     console.log(this.userData)
  //   })
  // }
  //
  // getImage(comp:string,image:string):any{
  //   this.api.getImage(comp,`${image}.jpeg`).subscribe(data=>{
  //     let reader = new FileReader()
  //
  //     reader.addEventListener('load',()=>{
  //       console.log(reader.result)
  //       return reader.result
  //     })
  //     reader.readAsDataURL(data)
  //
  //   })
  // }


  ngOnInit(): void {
  }
}
