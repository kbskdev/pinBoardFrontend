import {Component, ElementRef, Input, OnInit} from '@angular/core';
import * as PIXI from 'pixi.js'
import {HttpService} from "../../service/http.service";
import {Image} from "../../models/image";

@Component({
  selector: 'app-photo-canvas',
  templateUrl: './photo-canvas.component.html',
  styleUrls: ['./photo-canvas.component.css']
})
export class PhotoCanvasComponent implements OnInit {

  constructor(private el:ElementRef, private api:HttpService) { }


  app:PIXI.Application = new PIXI.Application({width:this.el.nativeElement.offsetWidth,height:this.el.nativeElement.offsetHeight,transparent:false})

  @Input() compId:string

  blank:Image

  imagesList = new Array<Image>()

  textureList = new Array<PIXI.Texture>()

  // fileRead(blob:Blob):Promise<string>{
  //   return new Promise<string>((resolve => {
  //
  //   }))
  // }

  ngOnInit(): void {
    const reader = new FileReader()
    reader.addEventListener('loadend',()=>{
      //console.log(reader.result)
      let image = new Image()
      image.src = reader.result as string
      this.textureList.push(new PIXI.Texture((new PIXI.BaseTexture(image))))
      console.log(this.textureList)
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
        this.imagesList[i].imageBlob=await this.api.getImagePromise(this.compId, `${this.imagesList[i]._id}.jpeg`)

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
