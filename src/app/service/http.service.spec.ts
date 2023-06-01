import { TestBed } from '@angular/core/testing';

import { HttpService } from './http.service';
import {
  HTTP_INTERCEPTORS,
   HttpClientModule,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from "@angular/common/http";
import {Observable} from 'rxjs';

describe('HttpService', () => {
  let service: HttpService;

  class mockAuthInterceptor implements HttpInterceptor {
      intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const newRequest = req.clone({setHeaders:{'authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MjZiZDQwNmUxYmFkNDljMjcyMjc2ZCIsInVzZXJuYW1lIjoibW9jayIsImlhdCI6MTY4MDU3MDIyMSwiZXhwIjoxNjgxNDM0MjIxfQ.2DJm7P0mYaL48zWJkSIUyvyZvblmtBFpe9aj7_NrfNU`}})
        return next.handle(newRequest);
      }

  }

  beforeEach(() => {
    TestBed.configureTestingModule({providers:[HttpService,{provide:HTTP_INTERCEPTORS,useClass:mockAuthInterceptor,multi:true}],imports:[HttpClientModule]});
    service = TestBed.inject(HttpService);
  });

  it('isAuthor should return true', (done:DoneFn) => {
    service.isAuthor("6426bd9c6e1bad49c2722777").subscribe({
      next:response=>{
        expect(response.status).toBeTrue()
        done()
      },
      error:err=>{
        done.fail("unexpected error")
      }
    })
  });

  it('isAuthor should return false', (done:DoneFn) => {
    service.isAuthor("6426bd9c6e1bad49c2700000").subscribe({
      next:response=>{
        expect(response.status).not.toBeTrue()
        done()
      },
      error:err=>{
        done.fail
      }
    })
  });
});
