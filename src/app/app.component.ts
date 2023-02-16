import { Component,OnInit } from '@angular/core';
import {HttpService} from "./service/http.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  constructor(private api:HttpService) {
  }
  ngOnInit() {
    this.api.getImage().subscribe(data=>{
      this.imageFromBlob(data)
    })
  }
  image:any

  imageFromBlob(image:Blob){
    let reader = new FileReader()
    reader.addEventListener("load", () => {
      this.image = reader.result;
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  title = 'pinboardfrontend';
}
