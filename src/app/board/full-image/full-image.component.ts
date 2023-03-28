import {Component, Input, OnInit} from '@angular/core';
import {ImageTile} from "../../models/image-tile";

@Component({
  selector: 'app-full-image',
  templateUrl: './full-image.component.html',
  styleUrls: ['./full-image.component.css']
})
export class FullImageComponent implements OnInit {

  constructor() { }

  @Input() image:ImageTile

  ngOnInit(): void {
  }

}
