import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {FileUploadInputForDirective} from "angular-material-fileupload";


@Component({
  selector: 'app-board-ui',
  templateUrl: './board-ui.component.html',
  styleUrls: ['./board-ui.component.css']
})
export class BoardUiComponent implements OnInit {

  constructor(private router:Router) { }

  editMode:boolean = false

  fileUploadQueue:any

  goBack(){
    this.router.navigate([''])
  }
  changeEditMode(){
    this.editMode = !this.editMode
  }

  addPhoto(){

  }

  fileReader = new FileReader()



  showPhoto(event:Blob){
    this.fileReader.readAsDataURL(event)
  }

  ngOnInit(): void {
    this.fileReader.addEventListener('loadend',()=>{
      let img = new Image()
      img.src = this.fileReader.result as string

      console.log(img)

    })
  }

}
