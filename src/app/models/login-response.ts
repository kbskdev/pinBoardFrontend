import {User} from "./user";

export interface LoginResponse {
  status:string
  user:User
  token:string
}
