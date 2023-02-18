import {Composition} from "./composition";

export interface User {
  _id:string
  username:string,
  password:string,
  email:string
  composition:[Composition]
}
