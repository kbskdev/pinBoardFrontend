import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) { }

  login(username:string,password:string):Observable<any>{
    return this.http.post('http://kbskdev.com/api/v1/users/login/',{username:username,password:password})
  }

  register(username:string,password:string):Observable<any>{
    return this.http.post('http://kbskdev.com/api/v1/users/register/',{username:username,password:password})
  }
}
