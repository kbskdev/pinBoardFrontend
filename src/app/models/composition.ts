import {Image} from "./image";

export interface Composition {
  _id:string
  name:string
  tags:string[]
  votes:number,
  images:Image[]
  public:string
}
