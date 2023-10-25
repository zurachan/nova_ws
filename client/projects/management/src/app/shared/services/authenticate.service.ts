import { Router } from '@angular/router';
import { UserService } from './user.service';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { BehaviorSubject, Observable, lastValueFrom } from 'rxjs';

import { Credential } from '../../model/credential.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';

const urlApi = 'https://localhost:44322/api/';
const currentData = 'Authentication';

@Injectable({
  providedIn: 'root'
})

export class AuthenticateService {
  constructor(private http: HttpClient, private router: Router) {
    this.credentialSubject = new BehaviorSubject<Credential>(JSON.parse(localStorage.getItem('credential')));
    this.credential = this.credentialSubject.asObservable();
  }

  private credentialSubject: BehaviorSubject<Credential>;
  public credential: Observable<Credential>;
  @Output() updateCredential = new EventEmitter<any>();


  get LoggedIn(): boolean {
    return !!this.credentialSubject.value;
  }

  get GetCredential() {
    return this.credentialSubject.value;
  }

  SetCredential(credential: any) {
    let currentCredential = JSON.parse(localStorage.getItem('credential'));
    currentCredential.user = credential;

    localStorage.removeItem('credential');
    this.credentialSubject.next(currentCredential);
    localStorage.setItem('credential', JSON.stringify(currentCredential));
    this.updateCredential.emit(currentCredential);
  }

  Logout() {
    localStorage.removeItem('credential');
    this.credentialSubject.next(null);
    this.router.navigate(['/login']);
  }

  async Login(model: any) {
    try {
      let res = await lastValueFrom<any>(this.onLogin(model));

      if (res.success) {
        let credential = new Credential();
        credential.token = res.token;
        credential.user = res.user;
        credential.role = res.role;

        this.credentialSubject.next(credential);

        localStorage.setItem('credential', JSON.stringify(credential));

        this.router.navigate(['']);
        return {
          isOk: true,
          data: credential,
          message: '',
        };
      } else {
        return {
          isOk: false,
          data: this.credentialSubject.value,
          message: res.message,
        };
      }
    } catch {
      return {
        isOk: false,
        message: 'Authentication failed',
      };
    }
  }

  onLogin(model: any) {
    return this.http.post(`${urlApi}` + `${currentData}` + "/Login", model);
  }
}

const jwtHelperService = new JwtHelperService();

@Injectable({
  providedIn: 'root'
})

export class AuthenticateGuard {
  constructor(
    private authService: AuthenticateService,
  ) { }

  canActivate(): boolean {
    let isLoggedIn = this.authService.LoggedIn;
    let currentUser = this.authService.GetCredential;

    //Check if the token is expired or not and if token is expired then redirect to login page and return false
    if (isLoggedIn && currentUser && !jwtHelperService.isTokenExpired(currentUser.token)) {
      return true;
    }
    this.authService.Logout();
    return false;
  }
}