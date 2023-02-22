import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CompListResponse} from "../models/comp-list-response";
import {OneCompResponse} from "../models/one-comp-response";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  myHeaders():HttpHeaders {
    return new HttpHeaders({
      'authorization': `Bearer ${localStorage.getItem('token')}`
    })
  }

  getImage(comp:string,image:string):Observable<Blob>{
    return this.http.get(`http://localhost:8000/api/v1/images/getImage/${comp}/${image}`,{responseType:'blob',headers:this.myHeaders()})
  }

  getCompList():Observable<CompListResponse>{
    return this.http.get<CompListResponse>('http://localhost:8000/api/v1/images/getCompositionList/',{headers:this.myHeaders()})
  }

  getOneComp(comp:string):Observable<OneCompResponse>{
    return this.http.get<OneCompResponse>(`http://localhost:8000/api/v1/images/getOneComp/${comp}`,{headers:this.myHeaders()})
  }

  getImagePromise(comp:string,image:string):Promise<Blob>{
    return new Promise<Blob>((resolve => {
      this.getImage(comp,image).subscribe(data=>{
        resolve(data)
      })
    }))
  }


  constructor(private http:HttpClient) { }
}
