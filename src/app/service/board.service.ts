import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  fileObserver:Subject<File> = new Subject<File>()

  constructor() { }
}
