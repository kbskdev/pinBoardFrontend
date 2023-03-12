import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {CompListResponse} from "../models/comp-list-response";
import {OneCompResponse} from "../models/one-comp-response";
import {Image} from "../models/image";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  domain  = 'kbskdev.com'



  getImage(comp:string,image:string):Observable<Blob>{
    return this.http.get(`http://${this.domain}/api/v1/images/getImage/${comp}/${image}`,{responseType:'blob'})
  }

  addComposition(name:string):Observable<any>{
    return this.http.post<any>(`http://${this.domain}/api/v1/images/addComposition/`,{name:name})
  }

  getCompList():Observable<CompListResponse>{
    return this.http.get<CompListResponse>(`http://${this.domain}/api/v1/images/getCompositionList/`)
  }

  getOneComp(comp:string):Observable<OneCompResponse>{
    return this.http.get<OneCompResponse>(`http://${this.domain}/api/v1/images/getOneComp/${comp}`)
  }

  getImagePromise(comp:string,image:string):Promise<Blob>{
    return new Promise<Blob>((resolve => {
      this.getImage(comp,image).subscribe(data=>{
        resolve(data)
      })
    }))
  }

  addImage(comp:string,body:FormData):Observable<{status:string,data:Image}>{
    return this.http.post<{status:string,data:Image}>(`http://${this.domain}/api/v1/images/addImage/${comp}`,body)
  }
  updateImagePosition(comp:string,image:string,x:number,y:number):Observable<any>{
    return this.http.patch<any>(`http://${this.domain}/api/v1/images/updateImagePosition/${comp}/${image}/${x}/${y}`,{})
  }

  deleteImage(comp:string,image:string):Observable<any>{
    return this.http.delete<any>(`http://${this.domain}/api/v1/images/deleteImage/${comp}/${image}`)
  }


  constructor(private http:HttpClient) { }
}
