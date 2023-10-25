import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestService extends BehaviorSubject<any> {
  protected router: Router;
  constructor(protected injector: Injector) {
    super(null);
    this.router = this.injector.get(Router);
  }
}
