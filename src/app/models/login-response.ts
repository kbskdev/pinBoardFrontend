import {User} from "./user";

export interface LoginResponse {
  status:string
  data:User
  token:string
}
