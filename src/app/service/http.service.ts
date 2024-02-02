import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {CompListResponse} from "../models/comp-list-response";
import {OneCompResponse} from "../models/one-comp-response";
import {Image} from "../models/image";
import {FullPublicCompList} from "../models/full-public-comp-list";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  domain  = 'pinboard.pl'



  getImagePublic(id:string,comp:string,image:string):Observable<Blob>{
    return this.http.get(`http://${this.domain}/api/v1/publicImages/getImage/${id}/${comp}/${image}`,{responseType:'blob'})
  }

  addComposition(name:string, publicity:boolean):Observable<any>{
    return this.http.post<any>(`http://${this.domain}/api/v1/images/addComposition/`,{name:name,public:publicity?"public":"private"})
  }

  getCompList():Observable<CompListResponse>{
    return this.http.get<CompListResponse>(`http://${this.domain}/api/v1/images/getCompositionList/`)
  }

  getOneComp(comp:string):Observable<OneCompResponse>{
    return this.http.get<OneCompResponse>(`http://${this.domain}/api/v1/images/getOneComp/${comp}`)
  }
  getOneCompPublic(user:string,comp:string):Observable<OneCompResponse>{
    return this.http.get<OneCompResponse>(`http://${this.domain}/api/v1/publicImages/getOneComp/${user}/${comp}`)
  }

  getFullPublicCompList():Observable<FullPublicCompList>{
    return this.http.get<FullPublicCompList>(`http://${this.domain}/api/v1/publicImages/getFullCompositionList/`)
  }

  getImagePromise(id:string,comp:string,image:string):Promise<Blob>{
    return new Promise<Blob>((resolve => {
      this.getImagePublic(id,comp,image).subscribe(data=>{
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

  updateImageSize(comp:string,image:string,width:number,height:number){
    return this.http.patch<any>(`http://${this.domain}/api/v1/images/updateImageSize/${comp}/${image}/${width}/${height}`,{})
  }
  updateImageInfo(comp:string,image:string,info:{title:string,date:string,description:string}){
    return this.http.patch<any>(`http://${this.domain}/api/v1/images/updateImageInfo/${comp}/${image}/`,info)
  }
  deleteImage(comp:string,image:string):Observable<any>{
    return this.http.delete<any>(`http://${this.domain}/api/v1/images/deleteImage/${comp}/${image}`)
  }

  isAuthor(comp:string):Observable<{status:boolean}>{
    return this.http.get<{status:boolean}>(`http://${this.domain}/api/v1/users/isAuthor/${comp}`)
  }


  constructor(private http:HttpClient) { }
}
