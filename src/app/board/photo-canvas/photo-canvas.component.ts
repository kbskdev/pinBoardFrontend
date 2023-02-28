import {Component, ElementRef, OnInit} from '@angular/core';
import * as PIXI from 'pixi.js'
import {HttpService} from "../../service/http.service";
import {Image} from "../../models/image";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-photo-canvas',
  templateUrl: './photo-canvas.component.html',
  styleUrls: ['./photo-canvas.component.css']
})
export class PhotoCanvasComponent implements OnInit {

  constructor(private el:ElementRef, private api:HttpService, private route:ActivatedRoute) {
    this.compId = this.route.snapshot.queryParamMap.get('id')!
  }


  app:PIXI.Application

  compId:string

  blank:Image

  imagesList = new Array<Image>()

  textureList = new Array<PIXI.Texture>()

  // fileRead(blob:Blob):Promise<string>{
  //   return new Promise<string>((resolve => {
  //
  //   }))
  // }

  ngOnInit(): void {
    this.app = new PIXI.Application({width:this.el.nativeElement.offsetWidth,height:this.el.nativeElement.offsetHeight})

    const reader = new FileReader()
    reader.addEventListener('loadend',()=>{
      let image = new Image()
      image.src = reader.result as string

      this.textureList.push(new PIXI.Texture((new PIXI.BaseTexture(image))))

      if(this.textureList.length===this.imagesList.length){
        this.textureList.forEach((x,index)=>{
          let photo = new PIXI.Sprite(x)
          photo.x = this.imagesList[index].position.x
          photo.y = this.imagesList[index].position.y
          this.app.stage.addChild(photo)
        })
      }

    })

    this.api.getOneComp(this.compId).subscribe(async( compData)=>{

      this.imagesList = compData.data.composition[0].images

      for(let i =0;i<this.imagesList.length;i++){
        this.imagesList[i].imageBlob=await this.api.getImagePromise(this.compId, `${this.imagesList[i]._id}.${this.imagesList[i].extension}`)

          if(reader.readyState!=1){
            reader.readAsDataURL(this.imagesList[i].imageBlob!)
          }
          else {
            i=i-1
          }
      }
    })





    this.el.nativeElement.appendChild(this.app.view)


  }

}
