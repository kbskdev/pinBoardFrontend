
export interface Image {
  votes?:number
  _id?:string
  position:{x:number,y:number}
  imageBlob:Blob
  imageString?:string
  extension?:string
  date?:string
  title?:string
  description?:string
  currentSize?:{height:number,width:number}
  originalSize?:{height:number,width:number}
}
