import * as PIXI from "pixi.js";
import {Image} from "./image";
import {CollisionPlace} from "./collision-place";


export class ImageTile {
  titleText: PIXI.Text | undefined
  dateText: PIXI.Text | undefined



  imageSprite: PIXI.Sprite

  container: PIXI.Container

  imageData:Image

  ready = false

  private reader = new FileReader()

  constructor(imageData:Image) {
    this.reader.addEventListener("loadend",()=>{
      this.imageData.imageString = this.reader.result as string
      this.imageSprite = new PIXI.Sprite(new PIXI.Texture((new PIXI.BaseTexture( this.reader.result as string))))
      this.imageSprite.zIndex = 0
      if(this.imageData.currentSize!=undefined){
        this.imageSprite.height=this.imageData.currentSize!.height
        this.imageSprite.width=this.imageData.currentSize!.width
      }
      else {
        setTimeout(()=>{
          this.imageData.currentSize = {height:this.imageSprite.height,width:this.imageSprite.width}
        },1)
      }

      if(this.imageData.originalSize==undefined){
        this.imageData.originalSize = {height:this.imageSprite.height,width:this.imageSprite.width}
      }

      this.container.sortableChildren = true

      this.container.x = this.imageData.position.x
      this.container.y = this.imageData.position.y

      this.container.addChild(this.imageSprite)
      this.ready = true

      setTimeout(()=>this.createContainer(),1)

    })
    this.imageData = imageData


    this.reader.readAsDataURL(this.imageData.imageBlob)
    this.container = new PIXI.Container()
  }
  private createContainer():void{
    this.imageData.title = this.imageData.title?this.imageData.title:""
    this.imageData.date = this.imageData.date?this.imageData.date:""
    this.imageData.description = this.imageData.description?this.imageData.description:""

    if (!this.titleText) {
      this.createTitleTile()
    }

    if ( !this.dateText) {
      this.createDateTile()
    }



  }//called when image is downloaded from database

  private createTitleTile(){
    this.titleText = new PIXI.Text(this.imageData.title!)
    this.titleText.zIndex = 3
    this.titleText.style.fontSize = 16
    this.titleText.resolution = 2

    this.container.addChild(this.titleText)

    this.titleText.y = -this.titleText.style.fontSize - 4
    this.titleText.x = 5
  }
  private deleteTitleTile(){
    this.container.parent.removeChild(this.titleText!)
    this.titleText!.parent.removeChild(this.titleText!)
    this.titleText = undefined as unknown as PIXI.Text

  }

  private createDateTile(){
    this.dateText = new PIXI.Text(this.imageData.date!)
    this.dateText.zIndex = 3
    this.dateText.style.fontSize = 14
    this.dateText.resolution = 2
    this.dateText.y = this.imageSprite.height
    this.dateText.x = 5

    this.container.addChild(this.dateText)
  }
  private deleteDateTile(){
    this.container.parent.removeChild(this.dateText!)
    this.dateText!.parent.removeChild(this.dateText!)
    this.dateText = undefined as unknown as PIXI.Text
  }

  updateTexts():void{
    if(this.titleText && this.imageData.title) this.titleText.text = this.imageData.title

    else if(this.imageData.title && !this.titleText) this.createTitleTile()
    else if(this.imageData.title==""&&this.titleText) this.deleteTitleTile()

    if(this.dateText && this.imageData.date) {
      this.dateText.text = this.imageData.date
    }

    else if(this.imageData.date && !this.dateText) this.createDateTile()
    else if(this.imageData.date==""&&this.dateText) this.deleteDateTile()
  }//method called on every form changes

  loadImage(){
    return new Promise<string>(resolve => {
      this.reader.onloadend = () => {resolve('')}
    })
  }

  checkCollision(mouse:MouseEvent,mainContainer:PIXI.Container/*,pivot:{x:number,y:number}*/,borderThickness=15):CollisionPlace{
    let mouseX = (mouse.offsetX / mainContainer.scale._x)
    let mouseY = (mouse.offsetY / mainContainer.scale._y)

    let imageBoundX = (this.container.x + (mainContainer.x / mainContainer.scale._x))
    let imageBoundY = (this.container.y + (mainContainer.y / mainContainer.scale._y))

    if((mouseX > imageBoundX ) &&
      (mouseX < this.imageSprite.width + imageBoundX ) &&
      (mouseY > imageBoundY ) &&
      (mouseY < this.imageSprite.height + imageBoundY)){

        if(
          (mouseX > imageBoundX ) &&
          (mouseX < borderThickness + imageBoundX ) &&
          (mouseY > imageBoundY) &&
          (mouseY < borderThickness + imageBoundY)){
            return CollisionPlace.TOP_LEFT
        }
        else if(
          (mouseX > this.imageSprite.width-borderThickness + imageBoundX ) &&
          (mouseX < this.imageSprite.width + imageBoundX ) &&
          (mouseY >imageBoundY ) &&
          (mouseY < borderThickness + imageBoundY )){
            return CollisionPlace.TOP_RIGHT
        }
        else if(
          (mouseX > imageBoundX )&&
          (mouseX < borderThickness + imageBoundX )&&
          (mouseY > this.imageSprite.height-borderThickness + imageBoundY ) &&
          (mouseY <  this.imageSprite.height + imageBoundY )){
          return CollisionPlace.BOTTOM_LEFT
        }
        else if(
          (mouseX > this.imageSprite.width-borderThickness + imageBoundX ) &&
          (mouseX < this.imageSprite.width + imageBoundX ) &&
          (mouseY > this.imageSprite.height-borderThickness + imageBoundY ) &&
          (mouseY < this.imageSprite.height + imageBoundY )){
          return CollisionPlace.BOTTOM_RIGHT
        }

        else if(
          (mouseX > imageBoundX ) &&
          (mouseX < this.imageSprite.width + imageBoundX ) &&
          (mouseY > imageBoundY ) &&
          (mouseY < borderThickness + imageBoundY )
          ){
            return CollisionPlace.TOP
        }
        else if(
          (mouseX > imageBoundX )&&
          (mouseX < this.imageSprite.width + imageBoundX ) &&
          (mouseY > this.imageSprite.height-borderThickness + imageBoundY ) &&
          (mouseY < this.imageSprite.height + imageBoundY )
        ){
          return CollisionPlace.BOTTOM
        }
        else if(
          (mouseX > imageBoundX ) &&
          (mouseX < borderThickness + imageBoundX ) &&
          (mouseY > imageBoundY ) &&
          (mouseY < this.imageSprite.height + imageBoundY )
        ){
          return CollisionPlace.LEFT
        }
        else if(
          (mouseX > this.imageSprite.width-borderThickness + imageBoundX ) &&
          (mouseX < this.imageSprite.width + imageBoundX ) &&
          (mouseY > imageBoundY ) &&
          (mouseY < this.imageSprite.height + imageBoundY )
        ){
          return CollisionPlace.RIGHT
        }
       return CollisionPlace.INSIDE
    }
    return CollisionPlace.NOT_IN
  }


  moveImage(e:MouseEvent,modifier:{x:number,y:number},scale:number) {
    let mouseX = e.clientX / scale
    let mouseY = e.clientY / scale


    let modifierX = (modifier.x)
    let modifierY = (modifier.y)

    this.container.x = mouseX - modifierX
    this.container.y = mouseY - modifierY
    this.imageData.position.x = mouseX - modifierX
    this.imageData.position.y = mouseY - modifierY
  }

  resizeImage(e:MouseEvent,initialSize:{height:number,width:number},initialPosition:{x:number,y:number},mapModifier:{x:number,y:number},border:CollisionPlace,scale:number){
    this.floorIt()

    let mouseX = e.offsetX / scale
    let mouseY = e.offsetY / scale

    let mapModifierY = mapModifier.y / scale
    let mapModifierX = mapModifier.x / scale

    let ratio = initialSize.width/initialSize.height

    if(border == CollisionPlace.TOP && ((initialSize.height - mouseY + mapModifierY  + initialPosition.y)>100 || this.imageSprite.height>200)){
      this.imageSprite.height = initialSize.height - mouseY + mapModifierY  + initialPosition.y
      this.container.y = mouseY - mapModifierY
      if(this.dateText)this.dateText.y = this.imageSprite.height
    }
    else if(border == CollisionPlace.BOTTOM && ((mouseY - mapModifierY - initialPosition.y)>100 || this.imageSprite.height>100)){
      this.imageSprite.height = mouseY - mapModifierY - initialPosition.y
      if(this.dateText)this.dateText.y = this.imageSprite.height
    }
   else if(border == CollisionPlace.LEFT && ((initialSize.width - mouseX + mapModifierX + initialPosition.x)>100 || this.imageSprite.width>100)){
     this.imageSprite.width = initialSize.width - mouseX + mapModifierX + initialPosition.x
     this.container.x = mouseX - mapModifierX
      if(this.dateText)this.dateText.y = this.imageSprite.height
   }
   else if(border== CollisionPlace.RIGHT && ((mouseX - mapModifierX - initialPosition.x)>100 || this.imageSprite.width>100)){
     this.imageSprite.width = mouseX - mapModifierX - initialPosition.x
      if(this.dateText)this.dateText.y = this.imageSprite.height
   }
   else  if (border==CollisionPlace.BOTTOM_RIGHT && ((mouseY - mapModifierY -initialPosition.y)>100 || this.imageSprite.height>100)){
      this.imageSprite.height = mouseY - mapModifierY -initialPosition.y
      this.imageSprite.width = ratio * this.imageSprite.height
      if(this.dateText)this.dateText.y = this.imageSprite.height
   }
   else  if (border==CollisionPlace.BOTTOM_LEFT && ((mouseY - mapModifierY - initialPosition.y)>100 || this.imageSprite.height>100)){
      this.imageSprite.height = mouseY - mapModifierY - initialPosition.y
      this.imageSprite.width = ratio * this.imageSprite.height
      this.container.x = initialPosition.x - (this.imageSprite.width - initialSize.width)
      if(this.dateText)this.dateText.y = this.imageSprite.height
   }
   else  if (border==CollisionPlace.TOP_RIGHT && ((initialSize.height - mouseY + mapModifierY + initialPosition.y)>100 || this.imageSprite.height>100)){
      this.imageSprite.height = initialSize.height - mouseY + mapModifierY + initialPosition.y
      this.imageSprite.width = ratio * this.imageSprite.height
      this.container.y = mouseY - mapModifierY
      if(this.dateText)this.dateText.y = this.imageSprite.height
   }
    else  if (border==CollisionPlace.TOP_LEFT && ((initialSize.height - mouseY + mapModifierY + initialPosition.y)>100 || this.imageSprite.height>100)){
      this.imageSprite.height = initialSize.height - mouseY + mapModifierY + initialPosition.y
      this.imageSprite.width = ratio * this.imageSprite.height
      this.container.y = mouseY - mapModifierY
      this.container.x = initialPosition.x - (this.imageSprite.width - initialSize.width)
      if(this.dateText)this.dateText.y = this.imageSprite.height
    }



    this.imageData.currentSize!.width = this.imageSprite.width
    this.imageData.currentSize!.height = this.imageSprite.height
    this.floorIt()
  }

  changeSize(scale:boolean,changedInput:string){
    this.floorIt()
    if(scale){
      let ratio = this.imageSprite.width/this.imageSprite.height
      if(changedInput=="width"){
        this.imageData.currentSize!.height =  this.imageData.currentSize!.width / ratio
      }
      else if(changedInput=="height"){
        this.imageData.currentSize!.width =  this.imageData.currentSize!.height * ratio
      }
    }

    this.floorIt()
  }
  updateSize(){
    this.imageSprite.height = this.imageData.currentSize!.height
    this.imageSprite.width = this.imageData.currentSize!.width
    if(this.dateText)this.dateText.y = this.imageSprite.height
  }
  floorIt(){
    this.imageSprite.width = Math.floor(this.imageSprite.width)
    this.imageSprite.height = Math.floor(this.imageSprite.height)
    this.imageData.currentSize!.height = Math.floor(this.imageData.currentSize!.height)
    this.imageData.currentSize!.width = Math.floor(this.imageData.currentSize!.width)
  }
}
