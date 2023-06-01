import * as PIXI from "pixi.js";
import {Image} from "./image";
import {CollisionPlace} from "./collision-place";


export class ImageTile {
  titleText: PIXI.Text | undefined
  dateText: PIXI.Text | undefined

  titleBackground: PIXI.Sprite | undefined
  dateBackground: PIXI.Sprite | undefined

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
      this.container.sortableChildren = true
      this.container.addChild(this.imageSprite)
      this.ready = true

      setTimeout(()=>this.createContainer(),1)

    })
    this.imageData = imageData

    this.reader.readAsDataURL(this.imageData.imageBlob)
    this.container = new PIXI.Container()
  }
  private createContainer():void{

    // this.imageData.position.x -= this.imageSprite.width/2
    // this.imageData.position.y -= this.imageSprite.height/2

    this.container.x = this.imageData.position.x
    this.container.y = this.imageData.position.y
    if (this.imageData.title && !this.titleText) {
      this.createTitleTile()
    }
    if (this.imageData.date && !this.dateText) {
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

    if(this.dateText && this.imageData.date) {this.dateText.text = this.imageData.date;console.log("update")}

    else if(this.imageData.date && !this.dateText) this.createDateTile()
    else if(this.imageData.date==""&&this.dateText) this.deleteDateTile()
  }//method called on every form changes

  loadImage(){
    return new Promise<string>(resolve => {
      this.reader.onloadend = () => { resolve('')}
    })
  }

  checkCollision(mouse:MouseEvent,mainContainer:PIXI.Container,borderThickness=15):CollisionPlace{
    if((mouse.offsetX > this.container.x + mainContainer.x) &&
      (mouse.offsetX < this.container.x + this.imageSprite.width + mainContainer.x) &&
      (mouse.offsetY > this.container.y + mainContainer.y) &&
      (mouse.offsetY < this.container.y + this.imageSprite.height + mainContainer.y)){
        if(
          (mouse.offsetX > this.container.x + mainContainer.x)&&
          (mouse.offsetX < this.container.x + borderThickness + mainContainer.x)&&
          (mouse.offsetY > this.container.y + mainContainer.y) &&
          (mouse.offsetY < this.container.y + borderThickness + mainContainer.y)){
            return CollisionPlace.TOP_LEFT
        }
        else if(
          (mouse.offsetX > this.container.x + this.imageSprite.width-borderThickness + mainContainer.x )&&
          (mouse.offsetX < this.container.x + this.imageSprite.width + mainContainer.x)&&
          (mouse.offsetY > this.container.y +mainContainer.y) &&
          (mouse.offsetY < this.container.y + borderThickness + mainContainer.y)){
            return CollisionPlace.TOP_RIGHT
        }
        else if(
          (mouse.offsetX > this.container.x + mainContainer.x)&&
          (mouse.offsetX < this.container.x + borderThickness + mainContainer.x)&&
          (mouse.offsetY > this.container.y + this.imageSprite.height-borderThickness + mainContainer.y) &&
          (mouse.offsetY < this.container.y +  this.imageSprite.height + mainContainer.y)){
          return CollisionPlace.BOTTOM_LEFT
        }
        else if(
          (mouse.offsetX > this.container.x + this.imageSprite.width-borderThickness + mainContainer.x )&&
          (mouse.offsetX < this.container.x + this.imageSprite.width + mainContainer.x)&&
          (mouse.offsetY > this.container.y + this.imageSprite.height-borderThickness + mainContainer.y) &&
          (mouse.offsetY < this.container.y +  this.imageSprite.height + mainContainer.y)){
          return CollisionPlace.BOTTOM_RIGHT
        }

        else if(
          (mouse.offsetX > this.container.x + mainContainer.x)&&
          (mouse.offsetX < this.container.x + this.imageSprite.width + mainContainer.x)&&
          (mouse.offsetY > this.container.y + mainContainer.y) &&
          (mouse.offsetY < this.container.y + borderThickness + mainContainer.y)
          ){
            return CollisionPlace.TOP
        }
        else if(
          (mouse.offsetX > this.container.x + mainContainer.x)&&
          (mouse.offsetX < this.container.x + this.imageSprite.width + mainContainer.x)&&
          (mouse.offsetY > this.container.y + this.imageSprite.height-borderThickness + mainContainer.y) &&
          (mouse.offsetY < this.container.y + this.imageSprite.height + mainContainer.y)
        ){
          return CollisionPlace.BOTTOM
        }
        else if(
          (mouse.offsetX > this.container.x + mainContainer.x)&&
          (mouse.offsetX < this.container.x + borderThickness + mainContainer.x)&&
          (mouse.offsetY > this.container.y + mainContainer.y) &&
          (mouse.offsetY < this.container.y + this.imageSprite.height + mainContainer.y)
        ){
          return CollisionPlace.LEFT
        }
        else if(
          (mouse.offsetX > this.container.x + this.imageSprite.width-borderThickness+ mainContainer.x)&&
          (mouse.offsetX < this.container.x + this.imageSprite.width + mainContainer.x)&&
          (mouse.offsetY > this.container.y + mainContainer.y) &&
          (mouse.offsetY < this.container.y + this.imageSprite.height + mainContainer.y)
        ){
          return CollisionPlace.RIGHT
        }


       return CollisionPlace.INSIDE
    }
    return CollisionPlace.NOT_IN
  }

  moveImage(e:MouseEvent,modifier:{x:number,y:number}){
    this.container.x=e.clientX-modifier.x
    this.container.y=e.clientY-modifier.y
    this.imageData.position.x=e.clientX-modifier.x
    this.imageData.position.y=e.clientY-modifier.y
  }




}
