import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  getImage():Observable<Blob>{
    return this.http.get('http://localhost:8000/api/v1/posts/getImage/',{responseType:'blob'})
  }

  constructor(private http:HttpClient) { }
}
