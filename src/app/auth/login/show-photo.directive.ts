import {Directive, ElementRef, Input, OnInit, Output} from '@angular/core';
import {HttpService} from "../../service/http.service";

@Directive({
  selector: '[appShowPhoto]'
})
export class ShowPhotoDirective implements OnInit{

  @Input() comp:string
  @Input() image:string

  @Output() test:string


  constructor(private el:ElementRef,private api:HttpService) {

  }

  ngOnInit() {
    this.api.getImage(`${this.comp}`,`${this.image}.jpeg`).subscribe(data=>{
      this.test = 'siur'
      const reader = new FileReader()
      reader.readAsDataURL(data)
      reader.addEventListener('load',()=>{
        this.el.nativeElement.src = reader.result
      })
    })
  }

}
