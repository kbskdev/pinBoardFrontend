enum enumTypes {
  "image","text"
}

export interface Image {
  votes:number
  _id:string
  type:enumTypes
  position:{x:number,y:number}
  imageBlob?:Blob
  extension:string
  imageObject?:Object
}
