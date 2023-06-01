import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import {HttpClientModule} from "@angular/common/http";

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({providers:[AuthService],imports:[HttpClientModule]});
    service = TestBed.inject(AuthService);
  });

  it('except to be logged', (done:DoneFn) => {
    service.login('mock','mockPassword').subscribe({
      next:response=>{
        expect(response.data.username).toBe("mock")
        done()
      },
      error:err => {
        done.fail("unexpected error")
      }
    })
  });

  it('except to be be not looged', (done:DoneFn) => {
    service.login('notExisting','wrongPassword').subscribe({
      next:response=>{
        done.fail('excepted error, not response')
      },
      error:err => {
        expect(err.status).toBe(401)
        done()
      }
    })
  })
});
