import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) { }

  login(email:string,password:string):Observable<any>{
    return this.http.post('http://kbskdev/api/v1/users/login/',{email:email,password:password})
  }

  register(username:string,email:string,password:string):Observable<any>{
    return this.http.post('http://kbskdev/api/v1/users/register/',{username:username,email:email,password:password})
  }
}
