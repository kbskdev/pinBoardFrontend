import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) { }

  domain  = 'localhost:8000'

  login(username:string,password:string):Observable<any>{
    return this.http.post(`http://${this.domain}/api/v1/users/login/`,{username:username,password:password})
  }

  register(username:string,password:string):Observable<any>{
    return this.http.post(`http://${this.domain}/api/v1/users/register/`,{username:username,password:password})
  }
}
