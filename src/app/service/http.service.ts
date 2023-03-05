import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CompListResponse} from "../models/comp-list-response";
import {OneCompResponse} from "../models/one-comp-response";
import {Image} from "../models/image";

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
    return this.http.get(`http://kbskdev/api/v1/images/getImage/${comp}/${image}`,{responseType:'blob',headers:this.myHeaders()})
  }

  addComposition(name:string):Observable<any>{
    return this.http.post<any>(`http://kbskdev/api/v1/images/addComposition/`,{name:name},{headers:this.myHeaders()})
  }

  getCompList():Observable<CompListResponse>{
    return this.http.get<CompListResponse>('http://kbskdev/api/v1/images/getCompositionList/',{headers:this.myHeaders()})
  }

  getOneComp(comp:string):Observable<OneCompResponse>{
    return this.http.get<OneCompResponse>(`http://kbskdev/api/v1/images/getOneComp/${comp}`,{headers:this.myHeaders()})
  }

  getImagePromise(comp:string,image:string):Promise<Blob>{
    return new Promise<Blob>((resolve => {
      this.getImage(comp,image).subscribe(data=>{
        resolve(data)
      })
    }))
  }

  addImage(comp:string,body:FormData):Observable<{status:string,data:Image}>{
    return this.http.post<{status:string,data:Image}>(`http://kbskdev/api/v1/images/addImage/${comp}`,body,{headers:this.myHeaders()})
  }
  updateImagePosition(comp:string,image:string,x:number,y:number):Observable<any>{
    return this.http.patch<any>(`http://kbskdev/api/v1/images/updateImagePosition/${comp}/${image}/${x}/${y}`,{},{headers:this.myHeaders()})
  }

  deleteImage(comp:string,image:string):Observable<any>{
    return this.http.delete<any>(`http://kbskdev/api/v1/images/deleteImage/${comp}/${image}`,{headers:this.myHeaders()})
  }


  constructor(private http:HttpClient) { }
}
