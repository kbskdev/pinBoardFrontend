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


  addPhotoMode = false
  deletePhotoMode = false

  goBack(){
    this.router.navigate([''])
  } //moving back to user panel
  changeAddPhotoMode(){
    this.deletePhotoMode = false
    this.addPhotoMode = !this.addPhotoMode
  }//PhotoMode for ui

  changeDeletePhotoMode(){
    this.deletePhotoMode = !this.deletePhotoMode
    this.addPhotoMode = false

  }//deletePhotoMode for ui

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
    this.newImagePosition = undefined as unknown as {x:number,y:number}
    this.changeAddPhotoMode()
  }//sending photo,updating,imageList,changing back addPhotoMode

  compId:string

  app:PIXI.Application
  mainContainer:PIXI.Container //container of photos

  pressedImage:{imageIndex:number,mouseX:number,mouseY:number,imageX:number,imageY:number}
  pressedCanvas:{mouseX:number,mouseY:number,canvasX:number,canvasY:number} //objects for info about clicked image or mainContainer


  imagesList = new Array<Image>()
  spriteList = new Array<PIXI.Sprite>()

  newImage:PIXI.Sprite
  newImageFile:File
  newImagePosition:{x:number,y:number}
  //info about added image


  newPhotoReader:FileReader = new FileReader()
  readNewPhoto(file:File,x:number,y:number){
    this.newImagePosition = {x:x+this.mainContainer.x,y:y+this.mainContainer.y}
    this.newImageFile= file
    this.newPhotoReader.readAsDataURL(file)
  }//that event is called when dragndrop directive emits event with dropped file


  // Event for zooming out and in, but that functionality needs changes in collision detection
  // @HostListener('mousewheel', ['$event'])
  // resize(e:any){
  //   if(e.wheelDelta>0) {
  //     this.mainContainer.scale.set(this.mainContainer.scale._x + 0.07)
  //   }
  //   if(e.wheelDelta<0){
  //     this.mainContainer.scale.set(this.mainContainer.scale._x - 0.07)
  //   }
  // }

  ngOnInit(): void {
    this.app = new PIXI.Application({width:this.el.nativeElement.offsetWidth,height:this.el.nativeElement.offsetHeight-45})
    this.mainContainer = new PIXI.Container()
    this.app.stage.addChild(this.mainContainer)

    this.api.getOneComp(this.compId).subscribe(async( compData)=>{
      this.imagesList = compData.data.composition[0].images //list of all images

      for(let i =0;i<this.imagesList.length;i++){
        this.imagesList[i].imageBlob=await this.api.getImagePromise(this.compId, `${this.imagesList[i]._id}.${this.imagesList[i].extension}`)
        if(initialReader.readyState!=1){
          initialReader.readAsDataURL(this.imagesList[i].imageBlob!)
        }
        else {i--}
      }// calling reader for every image, if reader is busy loop iteration is repeated
    })//getting all photos on board

    const initialReader = new FileReader()
    initialReader.addEventListener('loadend',()=>{
      this.spriteList.push(new PIXI.Sprite(new PIXI.Texture((new PIXI.BaseTexture( initialReader.result as string)))))

      this.mainContainer.addChild(this.spriteList[this.spriteList.length-1])
      this.spriteList[this.spriteList.length-1].x = this.imagesList[this.spriteList.length-1].position.x
      this.spriteList[this.spriteList.length-1].y = this.imagesList[this.spriteList.length-1].position.y
    })//adding read file to canvas, updating spriteList

    this.newPhotoReader.addEventListener('loadend',async()=>{
      this.newImage = new PIXI.Sprite(new PIXI.Texture((new PIXI.BaseTexture(this.newPhotoReader.result))))
      this.mainContainer.addChild(this.newImage)
      setTimeout(()=>{
        this.newImage.x = this.newImagePosition.x-(this.newImage.width/2) - this.mainContainer.x*2
        this.newImage.y = this.newImagePosition.y-this.newImage.height/2- this.mainContainer.y*2
        //calculating position of image, including movement of mainContainer,screen position, and size of image
        this.spriteList.push(this.newImage)
        this.sendPhoto()//sending photo to database after adding to canvas
      },1)//setTimeout is for making sure new image have width and height

    })//listener for adding new photos

    this.app.renderer.view.onmousedown = (e:any) =>{
      for(let i=0;i<this.spriteList.length;i++){
        if(
          (e.offsetX>this.spriteList[i].x+this.mainContainer.x)&&(e.offsetY>this.spriteList[i].y+this.mainContainer.y)&&
          (e.offsetX<this.spriteList[i].x+this.spriteList[i].width+this.mainContainer.x)&&
          (e.offsetY<this.spriteList[i].y+this.spriteList[i].height+this.mainContainer.y)){//checking if mouse was down on any image
          if(this.deletePhotoMode){//if user had deleteMode on, deleting an image
            this.spriteList[i].parent.removeChild(this.spriteList[i])
            this.spriteList.splice(i,1)
            this.api.deleteImage(this.compId,`${this.imagesList[i]._id}.${this.imagesList[i].extension}`).subscribe()
            break
          }
          else {//if deletePhotoMode was off, setting data for moving images around
            this.pressedImage = {imageIndex: i,mouseY:e.clientY,mouseX:e.clientX,imageX:e.clientX-this.spriteList[i].x,imageY:e.clientY-this.spriteList[i].y}
          }
        }
        else {//data used for moving canvas around
          this.pressedCanvas = {mouseY:e.clientY,mouseX:e.clientX,canvasX:e.clientX-this.mainContainer.x,canvasY:e.clientY-this.mainContainer.y}
        }
      }
    }//checking if user clicked on canvas or image, deleting image if deletePhoto mode on, saving data of pressed object
    this.app.renderer.view.onmouseup = (e:any) =>{
      if(this.pressedImage&&!this.newImage){ //updating position of moved image
        this.api.updateImagePosition(this.compId,
          `${this.imagesList[this.pressedImage.imageIndex]._id}.${this.imagesList[this.pressedImage.imageIndex].extension}`,
          this.spriteList[this.pressedImage.imageIndex].position.x,
          this.spriteList[this.pressedImage.imageIndex].position.y).subscribe(response=>{
        })
      }
      this.pressedImage = undefined as unknown as {imageIndex:number,mouseX:number,mouseY:number,imageX:number,imageY:number}
      this.pressedCanvas = undefined as unknown as {mouseX:number,mouseY:number,canvasX:number,canvasY:number}
    }//updating position of image if moved, clearing data of pressed objects
    this.app.renderer.view.onmousemove = (e:any) =>{
      if(this.pressedImage){//moving image on canvas
        this.spriteList[this.pressedImage.imageIndex].x=e.clientX-this.pressedImage.imageX
        this.spriteList[this.pressedImage.imageIndex].y=e.clientY-this.pressedImage.imageY
      }
      else if(this.pressedCanvas){//moving canvas around
        this.mainContainer.x=e.clientX-this.pressedCanvas.canvasX
        this.mainContainer.y=e.clientY-this.pressedCanvas.canvasY
      }
    }//moving either image or canvas around



    this.el.nativeElement.appendChild(this.app.view)
  }}
