import {Component, ElementRef, OnInit} from '@angular/core';
import * as PIXI from 'pixi.js'
import {HttpService} from "../../service/http.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ImageTile} from "../../models/image-tile";



@Component({
  selector: 'app-photo-canvas',
  templateUrl: './photo-canvas.component.html',
  styleUrls: ['./photo-canvas.component.css']
})
export class PhotoCanvasComponent implements OnInit {

  constructor(private el:ElementRef, private api:HttpService, private route:ActivatedRoute,private router:Router) {
    this.compId = this.route.snapshot.queryParamMap.get('id')!
  }
  compId:string
  app:PIXI.Application
  mainContainer:PIXI.Container //container of photos

  addPhotoMode = false
  deletePhotoMode = false
  dragPhotoMode = false

  newPhotoReader:FileReader = new FileReader()

  pressedImage:{imageIndex:number,mouseX:number,mouseY:number,imageX:number,imageY:number}
  pressedCanvas:{mouseX:number,mouseY:number,canvasX:number,canvasY:number} //objects for info about clicked image or mainContainer

  imageObjectList = new Array<ImageTile>()

  newImage:ImageTile

  newTitle:string
  newDate:string
  newDescription:string

  //info about added image

  goBack(){
    this.router.navigate([''])
  } //moving back to user panel
  changeAddPhotoMode(){
    this.deletePhotoMode = false
    this.addPhotoMode = !this.addPhotoMode
    this.dragPhotoMode = !this.dragPhotoMode
    if(!this.addPhotoMode){
      this.dragPhotoMode = false
    }
    if(this.newImage){
      this.newImage.container.parent.removeChild(this.newImage.container)
      this.newImage.container.destroy({children:true, texture:true, baseTexture:true})
      this.newImage = undefined as unknown as ImageTile
      this.imageObjectList.pop()
    }

    console.log(this.imageObjectList)
  }//PhotoMode for ui
  changeDeletePhotoMode(){
    this.deletePhotoMode = !this.deletePhotoMode
    this.addPhotoMode = false

  }//deletePhotoMode for ui

  async readNewPhoto(file:File,x:number,y:number){
      this.newImage = new ImageTile({imageBlob:file,position:{x: x + this.mainContainer.x, y: y + this.mainContainer.y},
        title:this.newTitle,date:this.newDate,description:this.newDescription})
      this.dragPhotoMode = false
      this.imageObjectList.push(this.newImage)

      await this.imageObjectList[this.imageObjectList.length - 1].loadImage()

      this.newImage.imageData.position.x = this.newImage.imageData.position.x - this.newImage.imageSprite.width/2
      this.newImage.imageData.position.y = this.newImage.imageData.position.y - this.newImage.imageSprite.height/2
      this.mainContainer.addChild(this.imageObjectList[this.imageObjectList.length-1].container)


      this.mainContainer.addChild(this.imageObjectList[this.imageObjectList.length-1].container)

  }//that event is called when dragndrop directive emits event with dropped file

  deletePhoto(id:number){
    this.imageObjectList[id].container.parent.removeChild(this.imageObjectList[id].container)
    this.api.deleteImage(this.compId,`${this.imageObjectList[id].imageData._id}.${this.imageObjectList[id].imageData.extension}`).subscribe()
    this.imageObjectList.splice(id,1)
  }

  sendPhoto(){
    const formData = new FormData()
    formData.append('photo',this.newImage.imageData.imageBlob!)
    formData.append('x', `${this.newImage.imageData.position!.x}`)
    formData.append('y', `${this.newImage.imageData.position!.y}`)
    this.newImage.imageData.title?formData.append('title',`${this.newImage.imageData.title}`):null
    this.newImage.imageData.date?formData.append('date', `${this.newImage.imageData.date}`):null
    this.newImage.imageData.description? formData.append('description',`${this.newImage.imageData.description}`):null

    this.api.addImage(this.compId,formData).subscribe(response=>{
      this.imageObjectList[this.imageObjectList.length-1].imageData._id = response.data._id
    })
    this.newImage = undefined as unknown as ImageTile
    this.changeAddPhotoMode()
  }//sending photo,updating,imageList,changing back addPhotoMode

    updateImage(){
    if(this.newImage){
      console.log(this.newDate)
      this.imageObjectList[this.imageObjectList.length-1].imageData.title = this.newTitle
      this.imageObjectList[this.imageObjectList.length-1].imageData.date = this.newDate
      this.imageObjectList[this.imageObjectList.length-1].updateTexts()
    }

    }

  ngOnInit(): void {
    this.app = new PIXI.Application({
      width:this.el.nativeElement.offsetWidth,
      height:this.el.nativeElement.offsetHeight-45,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
      resizeTo: this.el.nativeElement,
      antialias: true,
      backgroundColor: 0xdee1e3
    })
    this.mainContainer = new PIXI.Container()
    this.app.stage.addChild(this.mainContainer)

    this.api.getOneComp(this.compId).subscribe(async( compData)=>{
      for (const image of compData.data.composition[0].images){
        console.log(image)
        const file = await this.api.getImagePromise(this.compId, `${image._id}.${image.extension}`)
        this.imageObjectList.push(new ImageTile({...image,imageBlob:file}))
        await this.imageObjectList[this.imageObjectList.length-1].loadImage()
        this.mainContainer.addChild(this.imageObjectList[this.imageObjectList.length-1].container)

      }
    })//getting all photos on board

    this.app.renderer.view.onmousedown = (e:MouseEvent) =>{
      console.log(this.imageObjectList)
      for(let i=0;i<this.imageObjectList.length;i++){
        if(this.imageObjectList[i].checkCollision(e,this.mainContainer)){//checking if mouse was down on any image
          if(this.deletePhotoMode){//if user had deleteMode on, deleting an image
            this.deletePhoto(i)
            break
          }
          else {//if deletePhotoMode was off, setting data for moving images around
            this.pressedImage = {imageIndex: i,mouseY:e.clientY,mouseX:e.clientX,imageX:e.clientX-this.imageObjectList[i].container.x,imageY:e.clientY-this.imageObjectList[i].container.y}
          }
        }
        else {//data used for moving canvas around
          this.pressedCanvas = {mouseY:e.clientY,mouseX:e.clientX,canvasX:e.clientX-this.mainContainer.x,canvasY:e.clientY-this.mainContainer.y}
        }
      }
    }//checking if user clicked on canvas or image, deleting image if deletePhoto mode on, saving data of pressed object

    this.app.renderer.view.onmouseup = () =>{
      if(this.pressedImage&&!(this.pressedImage.imageIndex==this.imageObjectList.length-1&&this.newImage)){//updating position of moved image

        this.api.updateImagePosition(this.compId,
          `${this.imageObjectList[this.pressedImage.imageIndex].imageData._id}.${this.imageObjectList[this.pressedImage.imageIndex].imageData.extension}`,
        this.imageObjectList[this.pressedImage.imageIndex].container.x,
          this.imageObjectList[this.pressedImage.imageIndex].container.y).subscribe()
      }

      this.pressedImage = undefined as unknown as {imageIndex:number,mouseX:number,mouseY:number,imageX:number,imageY:number}
      this.pressedCanvas = undefined as unknown as {mouseX:number,mouseY:number,canvasX:number,canvasY:number}
    }//updating position of image if moved, clearing data of pressed objects
    this.app.renderer.view.onmousemove = (e:any) =>{
      if(this.pressedImage){//moving image on canvas
        this.imageObjectList[this.pressedImage.imageIndex].container.x=e.clientX-this.pressedImage.imageX
        this.imageObjectList[this.pressedImage.imageIndex].container.y=e.clientY-this.pressedImage.imageY
        this.imageObjectList[this.pressedImage.imageIndex].imageData.position.x=e.clientX-this.pressedImage.imageX
        this.imageObjectList[this.pressedImage.imageIndex].imageData.position.y=e.clientY-this.pressedImage.imageY
      }
      else if(this.pressedCanvas){//moving canvas around
        this.mainContainer.x=e.clientX-this.pressedCanvas.canvasX
        this.mainContainer.y=e.clientY-this.pressedCanvas.canvasY
      }
    }//moving either image or canvas around



    this.el.nativeElement.appendChild(this.app.view)
  }}
