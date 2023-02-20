enum enumTypes {
  "image","text"
}

export interface Image {
  votes:number
  _id:string
  type:enumTypes
  x?:number
  y?:number
  imageBlob?:Blob
}
