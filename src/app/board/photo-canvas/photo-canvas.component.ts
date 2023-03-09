import {Component, ElementRef, OnInit} from '@angular/core';
import * as PIXI from 'pixi.js'
import {HttpService} from "../../service/http.service";
import {Image} from "../../models/image";
import {ActivatedRoute, Router} from "@angular/router";


@Component({
  selector: 'app-photo-canvas',
  templateUrl: './photo-canvas.component.html',
  styleUrls: ['./photo-canvas.component.css']
})
export class PhotoCanvasComponent implements OnInit {

  constructor(private el:ElementRef, private api:HttpService, private route:ActivatedRoute,private router:Router) {
    this.compId = this.route.snapshot.queryParamMap.get('id')!
  }

  dragPhotoMode = false
  addPhotoMode = false
  deletePhotoMode = false

  goBack(){
    this.router.navigate([''])
  }
  changeAddPhotoMode(){
    this.deletePhotoMode = false
    this.addPhotoMode = !this.addPhotoMode
    this.dragPhotoMode = !this.dragPhotoMode
    if(!this.addPhotoMode){
      this.dragPhotoMode = false
    }
    if(this.newImage){
      this.newImage.parent.removeChild(this.newImage)
      this.spriteList.pop()
      this.newImage = undefined as unknown as PIXI.Sprite
      this.newImageFile = undefined as unknown as File
    }
  }

  changeDeletePhotoMode(){
    this.deletePhotoMode = !this.deletePhotoMode
    this.addPhotoMode = false
    this.dragPhotoMode = false
  }

  sendPhoto(){
    const formData = new FormData()
    formData.append('photo',this.newImageFile)
    formData.append('x', `${this.newImage.x}`)
    formData.append('y', `${this.newImage.y}`)

    this.api.addImage(this.compId,formData).subscribe(response=>{
      this.imagesList.push(response.data)
    })
    this.newImage = undefined as unknown as PIXI.Sprite
    this.newImageFile = undefined as unknown as File
    this.changeAddPhotoMode()
    console.log(this.imagesList)
    console.log(this.spriteList)
  }

  compId:string

  app:PIXI.Application

  pressedImage:{imageIndex:number,mouseX:number,mouseY:number,imageX:number,imageY:number}
  imagesList = new Array<Image>()
  spriteList = new Array<PIXI.Sprite>()

  newImage:PIXI.Sprite
  newImageFile:File


  newPhotoReader:FileReader = new FileReader()
  readNewPhoto(file:File){
    this.newImageFile= file
    this.dragPhotoMode = false
    this.newPhotoReader.readAsDataURL(file)

  }

  ngOnInit(): void {
    this.app = new PIXI.Application({width:this.el.nativeElement.offsetWidth,height:this.el.nativeElement.offsetHeight-45})

    const initialReader = new FileReader()
    initialReader.addEventListener('loadend',()=>{
      this.spriteList.push(new PIXI.Sprite(new PIXI.Texture((new PIXI.BaseTexture( initialReader.result as string)))))

      this.app.stage.addChild(this.spriteList[this.spriteList.length-1])
      this.spriteList[this.spriteList.length-1].x = this.imagesList[this.spriteList.length-1].position.x
      this.spriteList[this.spriteList.length-1].y = this.imagesList[this.spriteList.length-1].position.y

    })

    this.newPhotoReader.addEventListener('loadend',()=>{
      //let ext = data.split(':')[1].split('/')[1].split(';')[0]

      this.newImage = new PIXI.Sprite(new PIXI.Texture((new PIXI.BaseTexture(this.newPhotoReader.result))))
      this.newImage.x = this.app.view.width/2; this.newImage.y = this.app.view.height/2

      this.app.stage.addChild(this.newImage)
      this.spriteList.push(this.newImage)
      this.sendPhoto()
    })

    this.app.renderer.view.onmousedown = (e:any) =>{
      console.log(e)
      for(let i=0;i<this.spriteList.length;i++){
        if(
          (e.offsetX>this.spriteList[i].x)&&(e.offsetY>this.spriteList[i].y)&&
          (e.offsetX<this.spriteList[i].x+this.spriteList[i].width)&&
          (e.offsetY<this.spriteList[i].y+this.spriteList[i].height)){
          if(this.deletePhotoMode){
            this.spriteList[i].parent.removeChild(this.spriteList[i])
            this.spriteList.splice(i,1)
            console.log(this.spriteList)
            this.api.deleteImage(this.compId,`${this.imagesList[i]._id}.${this.imagesList[i].extension}`).subscribe()
            break
          }
          else {
            this.pressedImage = {imageIndex: i,mouseY:e.clientY,mouseX:e.clientX,imageX:e.clientX-this.spriteList[i].x,imageY:e.clientY-this.spriteList[i].y}
          }
        }
      }
    }
    this.app.renderer.view.onmouseup = (e:any) =>{
      if(this.pressedImage&&!this.newImage){
        this.api.updateImagePosition(this.compId,
          `${this.imagesList[this.pressedImage.imageIndex]._id}.${this.imagesList[this.pressedImage.imageIndex].extension}`,
          this.spriteList[this.pressedImage.imageIndex].position.x,
          this.spriteList[this.pressedImage.imageIndex].position.y).subscribe(response=>{
            console.log(response)
        })
      }
      this.pressedImage = undefined as unknown as {imageIndex:number,mouseX:number,mouseY:number,imageX:number,imageY:number}
    }
    this.app.renderer.view.onmousemove = (e:any) =>{
      if(this.pressedImage){
        this.spriteList[this.pressedImage.imageIndex].x=e.clientX-this.pressedImage.imageX
        this.spriteList[this.pressedImage.imageIndex].y=e.clientY-this.pressedImage.imageY
      }
    }

    this.api.getOneComp(this.compId).subscribe(async( compData)=>{
      this.imagesList = compData.data.composition[0].images
      console.log(this.imagesList)

      for(let i =0;i<this.imagesList.length;i++){
        this.imagesList[i].imageBlob=await this.api.getImagePromise(this.compId, `${this.imagesList[i]._id}.${this.imagesList[i].extension}`)
          if(initialReader.readyState!=1){
            initialReader.readAsDataURL(this.imagesList[i].imageBlob!)
          }
          else {i--}
      }
    })

    this.el.nativeElement.appendChild(this.app.view)
  }}
