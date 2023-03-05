import {Directive, EventEmitter, HostBinding, HostListener, Output} from '@angular/core';
import {promises} from "fs";
import {DomSanitizer} from "@angular/platform-browser";


@Directive({
  selector: '[appDragndrop]'
})
export class DragndropDirective {

  reader = new FileReader()

  @Output() droppedFile:EventEmitter<File> = new EventEmitter<File>()

  @HostBinding("style.background") private background = "rgba(147,147,147,0.6)";

  constructor(private sanitizer: DomSanitizer) {
  }

  @HostListener("dragover", ["$event"]) public onDragOver(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = "rgba(147,147,147,0.8)";
  }

  @HostListener("dragleave", ["$event"]) public onDragLeave(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = "rgba(147,147,147,0.5)";
  }

  @HostListener('drop', ['$event']) public onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.background = "rgba(147,147,147,0.5)";

    let file:File = event.dataTransfer!.files[0];

    this.droppedFile.emit(file)
  }
}
