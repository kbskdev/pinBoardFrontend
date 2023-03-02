import {Directive, EventEmitter, HostBinding, HostListener, Output} from '@angular/core';
import {promises} from "fs";
import {DomSanitizer} from "@angular/platform-browser";
import {BoardService} from "../service/board.service";

@Directive({
  selector: '[appDragndrop]'
})
export class DragndropDirective {

  @Output() files: EventEmitter<File> = new EventEmitter();

  @HostBinding("style.background") private background = "#eee";

  constructor(private sanitizer: DomSanitizer,private boardService:BoardService) { }

  @HostListener("dragover", ["$event"]) public onDragOver(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = "#999";
  }

  @HostListener("dragleave", ["$event"]) public onDragLeave(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = "#eee";
  }

  @HostListener('drop', ['$event']) public onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.background = '#eee';

    let file:File = event.dataTransfer!.files[0];

    this.boardService.fileObserver.next(file)
    // this.files.emit(file)
  }
}
