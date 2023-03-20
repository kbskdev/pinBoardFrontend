import * as PIXI from "pixi.js";

export class ImageTile {
  titleText: PIXI.Text | undefined
  dateText: PIXI.Text | undefined

  titleBackground: PIXI.Sprite | undefined
  dateBackground: PIXI.Sprite | undefined

  imageSprite: PIXI.Sprite

  container: PIXI.Container

  constructor(image: PIXI.Sprite, title?: string, date?: string) {
    this.imageSprite = image
    this.container = new PIXI.Container()

    if (title) {
      this.titleBackground = new PIXI.Sprite(PIXI.Texture.WHITE)
      this.titleBackground.width = this.imageSprite.width
      this.titleBackground.height = 30
      this.titleText = new PIXI.Text(title)
    }

    if (date) {
      this.dateBackground = new PIXI.Sprite(PIXI.Texture.WHITE)
      this.dateBackground.width = this.imageSprite.width
      this.dateBackground.height = 30
      this.dateText = new PIXI.Text(date)
    }

    this.container.addChild(this.imageSprite)

    this.titleText?this.container.addChild(this.titleText):null
    this.dateText?this.container.addChild(this.dateText):null
  }

  spawnImage(parentContainer:PIXI.Container):void{
    parentContainer.addChild(this.container)
  }

}
