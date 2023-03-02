import {Component, HostListener, OnInit} from '@angular/core';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent implements OnInit {

  constructor() {
  }
  ngOnInit() {
    this.isLogged = localStorage.getItem('user') != ('' || undefined)

  }

  @HostListener('loggedCheck')
  loggedCheck(){
    this.isLogged = localStorage.getItem('user') != ('' || undefined)
    console.log(localStorage)
  }



  isLogged:boolean = false
}
