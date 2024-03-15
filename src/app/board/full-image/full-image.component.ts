import {Component, Input, OnInit,AfterViewInit} from '@angular/core';
import {ImageTile} from "../../models/image-tile";

@Component({
  selector: 'app-full-image',
  templateUrl: './full-image.component.html',
  styleUrls: ['./full-image.component.css']
})
export class FullImageComponent implements OnInit,AfterViewInit {

  constructor() { }

  size ={width:0, height:0}
  fullImageStyle:any

  @Input() image:ImageTile



  ngOnInit(): void {
    if(this.image.imageData.currentSize!.width!>(window.innerWidth*0.7)){
      let ratio = this.image.imageData.currentSize!.width / this.image.imageData.currentSize!.height
      this.size.width = window.innerWidth * 0.7
      this.size.height = this.size.width / ratio
    }
    else if(this.image.imageData.currentSize!.height!>(window.innerHeight*0.7)){
      let ratio = this.image.imageData.currentSize!.width / this.image.imageData.currentSize!.height
      this.size.height = window.innerHeight * 0.7
      this.size.width = this.size.height * ratio
    }


    else {
      this.size.width = this.image.imageData.currentSize!.width
      this.size.height = this.image.imageData.currentSize!.height
    }

    this.fullImageStyle = {
      display:'block',
      position:'absolute',
      top:`calc(50% - ${ this.size.height/2}px)`,
      left:`calc(50% - ${ this.size.width/2}px)`,
      width:`${this.size.width}px`,
      minHeight:`${this.size.height}px`,
      maxWidth:'70%!important',
      maxHeight:'70%!important',
    }

    console.log(`width:${this.size.width}`)
    console.log(`height:${this.size.height}`)

  }
  ngAfterViewInit() {


  }

}
