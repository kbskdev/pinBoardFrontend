import * as PIXI from "pixi.js";
import {Image} from "./image";
import {HttpService} from "../service/http.service";

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
      this.imageSprite = new PIXI.Sprite(new PIXI.Texture((new PIXI.BaseTexture( this.reader.result as string))))
      this.imageSprite.zIndex = 0
      this.container.sortableChildren = true
      this.container.addChild(this.imageSprite)
      setTimeout(()=>this.createImageTile(),1)

    })
    this.imageData = imageData
    this.reader.readAsDataURL(this.imageData.imageBlob!)
    this.container = new PIXI.Container()
  }

  private createImageTile():void{
    if (this.imageData.title) {
      this.titleBackground = new PIXI.Sprite()
      this.titleBackground.width = this.imageSprite.width
      this.titleBackground.height = 20
      this.titleBackground.zIndex = 2


      this.titleText = new PIXI.Text(this.imageData.title)
      //this.titleText.width = this.imageSprite.width - 10
      this.titleText.zIndex = 3
      this.titleText.style.fontSize = 16
      this.titleText.resolution = 2
      this.container.addChild(this.titleBackground,this.titleText)

      this.titleBackground.y = 0
      this.titleBackground.x = 0
      this.titleText.y = 1
      this.titleText.x = 5
    }
    if (this.imageData.date) {
      this.dateBackground = new PIXI.Sprite()
      this.dateBackground.width = this.imageSprite.width
      this.dateBackground.height = 18
      this.dateBackground.zIndex= 2

      this.dateText = new PIXI.Text(this.imageData.date)
      //this.dateText.width = this.imageSprite.width
      this.dateText.zIndex= 3
      this.dateText.style.fontSize = 14
      this.dateText.resolution = 2
      this.container.addChild(this.dateBackground,this.dateText)

      this.dateBackground.y = (this.titleBackground?this.titleBackground.height:0) + this.imageSprite.height - 30
      this.dateBackground.x = 0
      this.dateText.y = (this.titleBackground?this.titleBackground.height:0) + this.imageSprite.height
      this.dateText.x = 3
    }

    this.imageSprite.y = 20
    this.ready = true
  }

  spawnImageTile(container:PIXI.Container):void{
    this.container.x = this.imageData.position.x
    this.container.y = this.imageData.position.y

    container.addChild(this.container)

  }

  checkCollision(mouse:MouseEvent,mainContainer:PIXI.Container):boolean{
    return (mouse.offsetX > this.container.x + mainContainer.x) && (mouse.offsetY > this.container.y +mainContainer.y) &&
      (mouse.offsetX < this.container.x + this.container.width + mainContainer.x) &&
      (mouse.offsetY < this.container.y + this.container.height + mainContainer.y)
  }

}
