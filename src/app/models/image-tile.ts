import * as PIXI from "pixi.js";
import {Image} from "./image";


export class ImageTile {
  titleText: PIXI.Text | undefined
  dateText: PIXI.Text | undefined

  titleBackground: PIXI.Sprite | undefined
  dateBackground: PIXI.Sprite | undefined

  imageSprite: PIXI.Sprite

  container: PIXI.Container

  imageData:Image

  ready = false

  empty = true

  private reader = new FileReader()

  constructor(imageData:Image) {
    this.reader.addEventListener("loadend",()=>{
      this.imageData.imageString = this.reader.result as string
      this.imageSprite = new PIXI.Sprite(new PIXI.Texture((new PIXI.BaseTexture( this.reader.result as string))))
      this.imageSprite.zIndex = 0
      this.container.sortableChildren = true
      this.container.addChild(this.imageSprite)
      this.empty = false
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
    this.empty = false
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
    this.empty = false
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

  checkCollision(mouse:MouseEvent,mainContainer:PIXI.Container):boolean{
    return (mouse.offsetX > this.container.x + mainContainer.x) && (mouse.offsetY > this.container.y +mainContainer.y) &&
      (mouse.offsetX < this.container.x + this.container.width + mainContainer.x) &&
      (mouse.offsetY < this.container.y + this.container.height + mainContainer.y)
  }
  //
  // checkBorder(mouse:MouseEvent,mainContainer:PIXI.Container):boolean{
  //   return (((mouse.offsetX > this.container.x  + mainContainer.x-20) &&
  //       (mouse.offsetY > this.container.y +mainContainer.y-20) &&
  //       (mouse.offsetX < this.container.x + this.imageSprite.width + mainContainer.x+20) &&
  //       (mouse.offsetY < this.container.y + this.imageSprite.height + mainContainer.y+20))
  //
  //     &&!((mouse.offsetX > this.container.x+10 + mainContainer.x)
  //       &&(mouse.offsetY > this.container.y+10 + mainContainer.y) &&
  //       (mouse.offsetX < this.container.x + this.imageSprite.width-10 + mainContainer.x) &&
  //       (mouse.offsetY < this.container.y + this.imageSprite.height-10 + mainContainer.y)))
  // }

}
