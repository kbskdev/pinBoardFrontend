import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as PIXI from 'pixi.js'
import {HttpService} from "../../service/http.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ImageTile} from "../../models/image-tile";
import {OneCompResponse} from "../../models/one-comp-response";
import {CollisionPlace} from "../../models/collision-place";
import {Modes} from "../../models/modes";
import {MatCheckbox} from "@angular/material/checkbox";


@Component({
  selector: 'app-photo-canvas',
  templateUrl: './photo-canvas.component.html',
  styleUrls: ['./photo-canvas.component.css']
})
export class PhotoCanvasComponent implements OnInit {

  isMobile:boolean = this.api.isMobile
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

  zoom:number = 1

  pressedImage:{imageIndex:number,mouseX:number,mouseY:number,imageX:number,imageY:number,initialWidth:number,initialHeight:number,initialX:number,initialY:number,cursorPosition:CollisionPlace}
  pressedCanvas:{mouseX:number,mouseY:number,canvasX:number,canvasY:number} //objects for info about clicked image or mainContainer
  lastClickedImage:number


  imageObjectList = new Array<ImageTile>()

  newImage:ImageTile

  newImageInfo={title:"",date:"",description:""}


  isAuthor:boolean = false


  cursorPosition: { place:CollisionPlace,imageIndex:number|null }


  @ViewChild('scale') scale:MatCheckbox;

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

      this.el.nativeElement.style.cursor = "auto"
    }
    else{
      if(this.mode == mode) this.mode = Modes.EDIT
      else this.mode = mode
    }
  }

  goBack(){
    this.router.navigate(['']).then()
  } //moving back to user panel

  async readNewPhoto(file:File,x:number,y:number){
    let scale = this.mainContainer.scale._x
    this.newImage = new ImageTile({imageBlob:file,position:{x: x/scale , y: y/scale },
      title:this.newImageInfo.title,date:this.newImageInfo.date,description:this.newImageInfo.description})
    this.mode = Modes.ADD

    this.imageObjectList.push(this.newImage)

    await this.imageObjectList[this.imageObjectList.length - 1].loadImage()


    setTimeout( ()=>{
      this.imageObjectList[this.imageObjectList.length - 1].imageData.position.x -= ((this.newImage.imageSprite.width*scale)/2) + (this.mainContainer.x)/scale
      this.imageObjectList[this.imageObjectList.length - 1].imageData.position.y -= ((this.newImage.imageSprite.height*scale)/2) + (this.mainContainer.y)/scale
      this.imageObjectList[this.imageObjectList.length-1].container.x = this.imageObjectList[this.imageObjectList.length - 1].imageData.position.x
      this.imageObjectList[this.imageObjectList.length-1].container.y = this.imageObjectList[this.imageObjectList.length - 1].imageData.position.y
      this.mainContainer.addChild(this.imageObjectList[this.imageObjectList.length-1].container)},1)


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
    this.newImage.imageData.description?formData.append('description',`${this.newImage.imageData.description}`):null

    this.api.addImage(this.compId,formData).subscribe(response=>{
      this.imageObjectList[this.imageObjectList.length-1].imageData._id = response.data._id
      this.api.updateImageSize(this.compId,
        `${this.imageObjectList[this.imageObjectList.length-1].imageData._id}.${this.imageObjectList[this.imageObjectList.length-1].imageData.extension}`,
        this.imageObjectList[this.imageObjectList.length-1].imageSprite.width,
        this.imageObjectList[this.imageObjectList.length-1].imageSprite.height).subscribe(x=>{})
    })


    this.newImage = undefined as unknown as ImageTile
    this.lastClickedImage = -1
    this.newImageInfo = {title:"",date:"",description:""}

    this.modeChange(Modes.ADD)
  }//sending photo,updating,imageList,changing back addPhotoMode

  updateImage(id:number=this.imageObjectList.length-1){
    if(this.newImage && id == this.imageObjectList.length-1){
      this.imageObjectList[id].imageData.title = this.newImageInfo.title
      this.imageObjectList[id].imageData.date = this.newImageInfo.date
      this.imageObjectList[id].imageData.description = this.newImageInfo.description
      this.imageObjectList[id].updateTexts()
    }
    else {
      this.imageObjectList[id].updateTexts()
    }
  }

  updateImageInfo(id:number){
    this.api.updateImageInfo(this.compId,this.imageObjectList[id].imageData._id!,{title:this.imageObjectList[id].imageData.title!,date:this.imageObjectList[id].imageData.date!,description:this.imageObjectList[id].imageData.description!}).subscribe()
  }
  updateImageSizeByForm(id:number){
    this.imageObjectList[id].updateSize()
    this.api.updateImageSize(this.compId,
      `${this.imageObjectList[id].imageData._id}.${this.imageObjectList[id].imageData.extension}`,
      this.imageObjectList[id].imageSprite.width,
      this.imageObjectList[id].imageSprite.height).subscribe()
  }

  backToOriSize(id:number){
    this.imageObjectList[id].imageData.currentSize = {...this.imageObjectList[id].imageData.originalSize!}
    this.updateImageSizeByForm(id)
  }

  async loadImages(compData:OneCompResponse){
    for (const image of compData.data.composition[0].images){
      const file = await this.api.getImagePromise(this.authorId,this.compId, `${image._id}.${image.extension}`)
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

    window.addEventListener('wheel',(e)=>{

      const modifier = {

        container: this.mainContainer,
        scale:  0,

        get x() {
          this.scale = this.container.scale._x
          return ((window.innerWidth / 2)/0.95 - (this.container.x)*1.3)  * 0.05 /* (1 + (1-this.scale)/2)*/

        },
        get y() {
          this.scale = this.container.scale._x

          return (((window.innerHeight-45) / 2)/0.95 - (this.container.y)*1.3) * 0.05 /*(1 + (1-this.scale)/2)*/
        }
      }

      if(e.deltaY>0 && this.zoom>=0.3){
        this.zoom -= 0.05
        this.mainContainer.scale.set(this.zoom)



        this.mainContainer.x += modifier.x
        this.mainContainer.y += modifier.y
      }
      else if(e.deltaY<0 && this.zoom<=1.6){
        this.zoom += 0.05


        this.mainContainer.scale.set(this.zoom)
        this.mainContainer.x -= modifier.x
        this.mainContainer.y -= modifier.y
      }
    })

    this.app.renderer.view.onpointerdown = (e:PointerEvent) => {
      if(e.pointerType == "touch"){
        for(let i = this.imageObjectList.length - 1; i>=0; i--) {
          this.cursorPosition = {place: this.imageObjectList[i].checkCollision(e, this.mainContainer), imageIndex: i}
          if(this.cursorPosition.place>0){break}
        }
        if(this.cursorPosition.place==0)this.cursorPosition.imageIndex = null
      }
      console.log(this.cursorPosition)

      if (!this.fullImage) {
        if (this.cursorPosition.imageIndex!=null) {//checking if mouse was down on any image
          if (this.mode == Modes.DELETE && this.isAuthor) {//if user had deleteMode on, deleting an image
            this.deletePhoto(this.cursorPosition.imageIndex)

          } else  {//if deletePhotoMode was off, setting data for moving images around

            this.pressedImage = {
              imageIndex: this.cursorPosition.imageIndex,
              mouseY: e.clientY,
              mouseX: e.clientX,
              imageX: e.clientX / this.mainContainer.scale._x - this.imageObjectList[this.cursorPosition.imageIndex].container.x ,
              imageY: e.clientY / this.mainContainer.scale._x - this.imageObjectList[this.cursorPosition.imageIndex].container.y ,
              initialWidth: this.imageObjectList[this.cursorPosition.imageIndex].imageSprite.width,
              initialHeight: this.imageObjectList[this.cursorPosition.imageIndex].imageSprite.height,
              initialX:this.imageObjectList[this.cursorPosition.imageIndex].container.x,
              initialY:this.imageObjectList[this.cursorPosition.imageIndex].container.y,
              cursorPosition:this.cursorPosition.place
            }
            this.lastClickedImage = this.pressedImage.imageIndex;


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
    this.app.renderer.view.onpointerup = () =>{

      if(this.pressedImage){ //updating position of moved image

        if((!this.imageMoved)&&(!this.imageResized)&&(this.cursorPosition.place>0)){

          this.fullImageData = this.imageObjectList[this.pressedImage.imageIndex]

          let fullImageSize =  {width:0,height:0}
          if(this.fullImageData.imageData.currentSize!.height>(window.innerHeight*0.7)){
            let ratio = this.fullImageData.imageData.currentSize!.width / this.fullImageData.imageData.currentSize!.height
            fullImageSize.height = window.innerHeight * 0.7
            fullImageSize.width = fullImageSize.height * ratio

          }
          else if(this.fullImageData.imageData.currentSize!.width>(window.innerWidth*0.7)){
            let ratio = this.fullImageData.imageData.currentSize!.width / this.fullImageData.imageData.currentSize!.height
            fullImageSize.width = window.innerWidth * 0.7
            fullImageSize.height = fullImageSize.width / ratio

          }
          else{
            fullImageSize.width = this.fullImageData.imageData.currentSize!.width
            fullImageSize.height = this.fullImageData.imageData.currentSize!.height

          }
          this.fullImageStyle = {
            display:'block',
            position:'absolute',
            top:`calc(50% - ${this.fullImageData.imageSprite.height/2}px)`,
            left:`calc(50% - ${this.fullImageData.imageSprite.width/2}px)`,
            width:`${fullImageSize.width}px`,
            height:`${fullImageSize.height}px`,
            maxWidth:'70%!important',
            maxHeight:'70%!important',
            img:{
              width:`200px`,
              height:`100px`

            }
          }//style of fullImage
          this.fullImage = true

        }else if(this.isAuthor) {
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
      else if(this.fullImage){
        this.fullImage = false
      }

      this.imageMoved = false
      this.imageResized = false
      this.pressedImage = undefined as unknown as {imageIndex:number,mouseX:number,mouseY:number,imageX:number,imageY:number,initialWidth:number,initialHeight:number,initialX:number,initialY:number,cursorPosition:CollisionPlace}
      this.pressedCanvas = undefined as unknown as {mouseX:number,mouseY:number,canvasX:number,canvasY:number}

    }//updating position of image if moved, clearing data of pressed objects
    this.app.renderer.view.onpointermove = (e:PointerEvent) =>{
      console.log("e")
      for(let i = this.imageObjectList.length - 1; i>=0; i--){

        this.cursorPosition = {place:this.imageObjectList[i].checkCollision(e,this.mainContainer),imageIndex:i}
        if(this.pressedImage && this.cursorPosition.imageIndex == this.pressedImage.imageIndex) break

        if(!this.pressedImage){
          if(this.cursorPosition.place==CollisionPlace.TOP_LEFT || this.cursorPosition.place==CollisionPlace.BOTTOM_RIGHT){
            if(this.mode > 0) this.el.nativeElement.style.cursor = "nwse-resize";
            break
          }
          else if(this.cursorPosition.place==CollisionPlace.TOP_RIGHT || this.cursorPosition.place==CollisionPlace.BOTTOM_LEFT){
            if(this.mode > 0) this.el.nativeElement.style.cursor = "nesw-resize"
            break
          }

          else if(this.cursorPosition.place==CollisionPlace.TOP || this.cursorPosition.place==CollisionPlace.BOTTOM){
            if(this.mode > 0) this.el.nativeElement.style.cursor = "ns-resize"
            break
          }
          else if(this.cursorPosition.place==CollisionPlace.LEFT || this.cursorPosition.place==CollisionPlace.RIGHT){
            if(this.mode > 0) this.el.nativeElement.style.cursor = "ew-resize"
            break
          }

          else if(this.cursorPosition.place==CollisionPlace.INSIDE ){
            if(this.mode > 0) this.el.nativeElement.style.cursor = "grab"
            break
          }

          else if(this.pressedImage==undefined) {
            this.cursorPosition.imageIndex = null
            this.el.nativeElement.style.cursor = "auto"
          }
        }

      }
      if(this.pressedImage && this.isAuthor && this.pressedImage.cursorPosition == 1 && this.mode > 0){//moving image on canvas
        this.imageObjectList[this.pressedImage.imageIndex].moveImage(e,{x:this.pressedImage.imageX,y:this.pressedImage.imageY},this.mainContainer.scale._x)
        this.imageMoved = true
      }

      else if(this.pressedImage && this.isAuthor && this.pressedImage.cursorPosition > 1 && this.mode > 0){
        this.imageObjectList[this.pressedImage.imageIndex].resizeImage(e,{height:this.pressedImage.initialHeight,width:this.pressedImage.initialWidth},{x:this.pressedImage.initialX,y:this.pressedImage.initialY},{x:this.mainContainer.position.x,y:this.mainContainer.position.y},this.pressedImage.cursorPosition,this.mainContainer.scale._x)
        this.imageResized = true
      }
      else if(this.pressedCanvas){//moving canvas around
        this.mainContainer.x=e.clientX-this.pressedCanvas.canvasX
        this.mainContainer.y=e.clientY-this.pressedCanvas.canvasY
      }
    }//moving either image or canvas around

    this.el.nativeElement.appendChild(this.app.view)
  }

  public readonly Math = Math;

}
