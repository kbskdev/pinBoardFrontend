import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CompListResponse} from "../models/comp-list-response";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  myHeaders():HttpHeaders {
    return new HttpHeaders({
      'authorization': `Bearer ${localStorage.getItem('token')}`
    })
  }

  getImage():Observable<Blob>{
    return this.http.get('http://localhost:8000/api/v1/posts/getImage/',{responseType:'blob'})
  }

  getCompList():Observable<CompListResponse>{
    return this.http.get<CompListResponse>('http://localhost:8000/api/v1/images/getCompositionList/',{headers:this.myHeaders()})
  }

  constructor(private http:HttpClient) { }
}
