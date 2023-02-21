import {Component, ElementRef, Input, NgZone, OnInit} from '@angular/core';
import * as PIXI from 'pixi.js'
import {HttpService} from "../../service/http.service";
import {Image} from "../../models/image";

@Component({
  selector: 'app-photo-canvas',
  templateUrl: './photo-canvas.component.html',
  styleUrls: ['./photo-canvas.component.css']
})
export class PhotoCanvasComponent implements OnInit {

  constructor(private el:ElementRef, private api:HttpService) { }


  app:PIXI.Application = new PIXI.Application({width:this.el.nativeElement.offsetWidth,height:this.el.nativeElement.offsetHeight,transparent:false})

  @Input() compId:string

  imagesList:[Image] | any = []

  ngOnInit(): void {

    this.api.getOneComp(this.compId).subscribe(data=>{
      data.data.composition[0].images.forEach((x,index)=>{
        this.api.getImage(this.compId,`${x._id}.jpeg`).subscribe(data=>{
          this.imagesList[index]=x;
          this.imagesList[index].imageBlob=data
        })

      })
    })



    this.el.nativeElement.appendChild(this.app.view)
  }

}
