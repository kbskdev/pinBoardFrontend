import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

import {LoginResponse} from "../models/login-response";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) { }

  domain  = 'pinboard.pl'

  login(username:string,password:string):Observable<LoginResponse>{
    return this.http.post<LoginResponse>(`https://${this.domain}/api/v1/users/login/`,{username:username,password:password})
  }

  register(username:string,password:string):Observable<any>{
    return this.http.post(`https://${this.domain}/api/v1/users/register/`,{username:username,password:password})
  }
}
