import {Component, ElementRef, OnInit} from '@angular/core';
import * as PIXI from 'pixi.js'
import {HttpService} from "../../service/http.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ImageTile} from "../../models/image-tile";
import {OneCompResponse} from "../../models/one-comp-response";
import {CollisionPlace} from "../../models/collision-place";
import {Modes} from "../../models/modes";


@Component({
  selector: 'app-photo-canvas',
  templateUrl: './photo-canvas.component.html',
  styleUrls: ['./photo-canvas.component.css']
})
export class PhotoCanvasComponent implements OnInit {

  constructor(private el:ElementRef, private api:HttpService, private route:ActivatedRoute,private router:Router) {
    this.compId = this.route.snapshot.queryParamMap.get('id')!
    this.authorId = this.route.snapshot.queryParamMap.get('userId')!
  }
  compId:string
  authorId:string
  app:PIXI.Application
  mainContainer:PIXI.Container //container of photos

  mode:Modes = Modes.VIEW
  allModes = Modes

  newPhotoReader:FileReader = new FileReader()

  pressedImage:{imageIndex:number,mouseX:number,mouseY:number,imageX:number,imageY:number,initialWidth:number,initialHeight:number,initialX:number,initialY:number,cursorPosition:CollisionPlace}
  pressedCanvas:{mouseX:number,mouseY:number,canvasX:number,canvasY:number} //objects for info about clicked image or mainContainer

  imageObjectList = new Array<ImageTile>()

  newImage:ImageTile

  newTitle:string
  newDate:string
  newDescription:string

  isAuthor:boolean = false
  isPublic:boolean = false

  cursorPosition: { place:CollisionPlace,imageIndex:number|null }


  imageMoved:boolean = false
  imageResized:boolean = false
  fullImage:boolean = false
  fullImageData:ImageTile
  fullImageStyle:any
  //info about added image

  modeChange(mode:Modes){
    if(mode == Modes.EDIT){
      if(this.mode == Modes.VIEW) this.mode = Modes.EDIT
      else this.mode = Modes.VIEW
    }
    else{
      if(this.mode == mode) this.mode = Modes.EDIT
      else this.mode = mode
    }
  }

  goBack(){
    this.router.navigate([''])
  } //moving back to user panel

  async readNewPhoto(file:File,x:number,y:number){
      this.newImage = new ImageTile({imageBlob:file,position:{x: x + this.mainContainer.x, y: y + this.mainContainer.y},
        title:this.newTitle,date:this.newDate,description:this.newDescription})
    this.mode = Modes.ADD

      this.imageObjectList.push(this.newImage)
      //console.log(this.imageObjectList)

      await this.imageObjectList[this.imageObjectList.length - 1].loadImage()

      this.newImage.imageData.position.x -= this.newImage.imageSprite.width/2
      this.newImage.imageData.position.y -= this.newImage.imageSprite.height/2
      this.mainContainer.addChild(this.imageObjectList[this.imageObjectList.length-1].container)

  }//that event is called when dragndrop directive emits event with dropped file

  deletePhoto(id:number){
    this.api.deleteImage(this.compId,`${this.imageObjectList[id].imageData._id}.${this.imageObjectList[id].imageData.extension}`).subscribe()

    this.imageObjectList[id].container.parent.removeChild(this.imageObjectList[id].container)
    this.imageObjectList[id].container.destroy({children:true, texture:true, baseTexture:true})

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
    //this.changeAddPhotoMode()
    this.newImage.imageData.title = ""
    this.newImage.imageData.date = ""
    this.newImage.imageData.description = ""
  }//sending photo,updating,imageList,changing back addPhotoMode

    updateImage(){
      if(this.newImage){
        this.imageObjectList[this.imageObjectList.length-1].imageData.title = this.newTitle
        this.imageObjectList[this.imageObjectList.length-1].imageData.date = this.newDate
        this.imageObjectList[this.imageObjectList.length-1].imageData.description = this.newDescription
        this.imageObjectList[this.imageObjectList.length-1].updateTexts()
      }
    }

    async loadImages(compData:OneCompResponse){
      for (const image of compData.data.composition[0].images){
        const file = await this.api.getImagePromise(this.authorId,this.compId, `${image._id}.${image.extension}`)
        //console.log(image)
        this.imageObjectList.push(new ImageTile({...image,imageBlob:file}))
        await this.imageObjectList[this.imageObjectList.length-1].loadImage()
        this.mainContainer.addChild(this.imageObjectList[this.imageObjectList.length-1].container)
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

    this.api.isAuthor(this.compId).subscribe(result=>{
      this.isAuthor = result.status
      this.isAuthor?this.api.getOneComp(this.compId).subscribe(async( compData)=>{
          await this.loadImages(compData)
        }
      ):this.api.getOneCompPublic(this.authorId,this.compId).subscribe(async (compData)=>{
        await this.loadImages(compData)
      })

    })
    //getting all photos on board

    this.app.renderer.view.onmousedown = (e:MouseEvent) => {
      if (!this.fullImage) {
          if (this.cursorPosition.place>0 && this.cursorPosition.imageIndex!=null) {//checking if mouse was down on any image
            //console.log(this.cursorPosition.imageIndex)
            if (this.mode == Modes.DELETE && this.isAuthor) {//if user had deleteMode on, deleting an image
              this.deletePhoto(this.cursorPosition.imageIndex)

            } else {//if deletePhotoMode was off, setting data for moving images around
              this.pressedImage = {
                imageIndex: this.cursorPosition.imageIndex,
                mouseY: e.clientY,
                mouseX: e.clientX,
                imageX: e.clientX - this.imageObjectList[this.cursorPosition.imageIndex].container.x,
                imageY: e.clientY - this.imageObjectList[this.cursorPosition.imageIndex].container.y,
                initialWidth: this.imageObjectList[this.cursorPosition.imageIndex].imageSprite.width,
                initialHeight: this.imageObjectList[this.cursorPosition.imageIndex].imageSprite.height,
                initialX:this.imageObjectList[this.cursorPosition.imageIndex].container.x,
                initialY:this.imageObjectList[this.cursorPosition.imageIndex].container.y,
                cursorPosition:this.cursorPosition.place
              }
            }
          } else {//data used for moving canvas around
            this.pressedCanvas = {
              mouseY: e.clientY,
              mouseX: e.clientX,
              canvasX: e.clientX - this.mainContainer.x,
              canvasY: e.clientY - this.mainContainer.y
            }

          }

      }
    }//checking if user clicked on canvas or image, deleting image if deletePhoto mode on, saving data of pressed object
    this.app.renderer.view.onmouseup = () =>{
      if(this.pressedImage&&!(this.pressedImage.imageIndex==this.imageObjectList.length-1&&this.newImage)){//updating position of moved image

        if((!this.imageMoved)&&(!this.imageResized)){
          this.fullImage = true
          this.fullImageData = this.imageObjectList[this.pressedImage.imageIndex]
          this.fullImageStyle = {
            display:'block',
            position:'absolute',
            top:`max(calc(50% - ${this.fullImageData.imageSprite.height/2}px), 15%)`,
            left:`max(calc(50% - ${this.fullImageData.imageSprite.width/2}px), 15%)`,
            width:`${this.fullImageData.imageSprite.width}px`,
            height:`${this.fullImageData.imageSprite.height}px+200px`,
            maxWidth:'70%',
            maxHeight:'70%',
                                 }//style of fullImage
        }else {
          if(this.isAuthor){
            this.api.updateImagePosition(this.compId,
              `${this.imageObjectList[this.pressedImage.imageIndex].imageData._id}.${this.imageObjectList[this.pressedImage.imageIndex].imageData.extension}`,
              this.imageObjectList[this.pressedImage.imageIndex].container.x,
              this.imageObjectList[this.pressedImage.imageIndex].container.y).subscribe()
            this.api.updateImageSize(this.compId,
              `${this.imageObjectList[this.pressedImage.imageIndex].imageData._id}.${this.imageObjectList[this.pressedImage.imageIndex].imageData.extension}`,
              this.imageObjectList[this.pressedImage.imageIndex].imageSprite.width,
              this.imageObjectList[this.pressedImage.imageIndex].imageSprite.height).subscribe()
          }
        }
      }
      else if(this.fullImage){
        this.fullImage = false
      }

      this.imageMoved = false
      this.imageResized = false
      this.pressedImage = undefined as unknown as {imageIndex:number,mouseX:number,mouseY:number,imageX:number,imageY:number,initialWidth:number,initialHeight:number,initialX:number,initialY:number,cursorPosition:CollisionPlace}
      this.pressedCanvas = undefined as unknown as {mouseX:number,mouseY:number,canvasX:number,canvasY:number}
    }//updating position of image if moved, clearing data of pressed objects
    this.app.renderer.view.onmousemove = (e:any) =>{
            for(let i = this.imageObjectList.length - 1; i>=0; i--){
              this.cursorPosition = {place:this.imageObjectList[i].checkCollision(e,this.mainContainer),imageIndex:i}

              if(!this.pressedImage){
                if(this.cursorPosition.place==CollisionPlace.TOP_LEFT || this.cursorPosition.place==CollisionPlace.BOTTOM_RIGHT){
                  this.el.nativeElement.style.cursor = "nwse-resize"
                  break
                }
                else if(this.cursorPosition.place==CollisionPlace.TOP_RIGHT || this.cursorPosition.place==CollisionPlace.BOTTOM_LEFT){
                  this.el.nativeElement.style.cursor = "nesw-resize"
                  break
                }

                else if(this.cursorPosition.place==CollisionPlace.TOP || this.cursorPosition.place==CollisionPlace.BOTTOM){
                  this.el.nativeElement.style.cursor = "ns-resize"
                  break
                }
                else if(this.cursorPosition.place==CollisionPlace.LEFT || this.cursorPosition.place==CollisionPlace.RIGHT){
                  this.el.nativeElement.style.cursor = "ew-resize"
                  break
                }

                else if(this.cursorPosition.place==CollisionPlace.INSIDE ){
                  this.el.nativeElement.style.cursor = "grab"
                  break
                }

                else if(this.pressedImage==undefined) {
                  this.cursorPosition.imageIndex = null
                  this.el.nativeElement.style.cursor = "auto"
                }
              }

            }
            if(this.pressedImage && this.isAuthor && this.pressedImage.cursorPosition == 1){//moving image on canvas
              this.imageObjectList[this.pressedImage.imageIndex].moveImage(e,{x:this.pressedImage.imageX,y:this.pressedImage.imageY})
              this.imageMoved = true
            }
            else if(this.pressedImage && this.isAuthor && this.pressedImage.cursorPosition > 1){
              this.imageObjectList[this.pressedImage.imageIndex].resizeImage(e,{height:this.pressedImage.initialHeight,width:this.pressedImage.initialWidth},{x:this.pressedImage.initialX,y:this.pressedImage.initialY},{x:this.mainContainer.position.x,y:this.mainContainer.position.y},this.pressedImage.cursorPosition)
              this.imageResized = true
            }
            else if(this.pressedCanvas){//moving canvas around
              this.mainContainer.x=e.clientX-this.pressedCanvas.canvasX
              this.mainContainer.y=e.clientY-this.pressedCanvas.canvasY
            }
          }//moving either image or canvas around

    this.el.nativeElement.appendChild(this.app.view)
  }
}
