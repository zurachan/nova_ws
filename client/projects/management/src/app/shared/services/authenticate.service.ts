import { Router } from '@angular/router';
import { UserService } from './user.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, lastValueFrom } from 'rxjs';

import { Credential } from '../../model/credential.model';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})

export class AuthenticateService {
  constructor(private userService: UserService,
    private router: Router) {
    this.credentialSubject = new BehaviorSubject<Credential>(JSON.parse(localStorage.getItem('token')));
    this.credential = this.credentialSubject.asObservable();
  }

  private credentialSubject: BehaviorSubject<Credential>;
  public credential: Observable<Credential>;

  get LoggedIn(): boolean {
    return !!this.credentialSubject.value;
  }

  get GetCredential() {
    return this.credentialSubject.value;
  }

  // get getCurrentUser() {
  //   return this.credentialSubject.value.user;
  // }

  Logout() {
    localStorage.removeItem('token');
    this.credentialSubject.next(null);
    this.router.navigate(['/login']);
  }

  async Login(model: any) {
    try {
      let res = await lastValueFrom<any>(this.userService.Login(model));

      if (res.success) {
        let credential = new Credential();
        credential.token = res.token;
        credential.user = res.user;
        credential.role = res.role;

        this.credentialSubject.next(credential);

        localStorage.setItem('token', JSON.stringify(res.token));
        // localStorage.setItem('role', JSON.stringify(rs.role[0].role.name));
        // localStorage.setItem('username', JSON.stringify(rs.role[0].role.name));
        // localStorage.setItem('role', JSON.stringify(rs.role[0].role.name));
        // localStorage.setItem('userId', JSON.stringify(rs.user.id));
        // localStorage.setItem('fullName', JSON.stringify(rs.user.fullName));
        // localStorage.setItem('username', JSON.stringify(rs.user.username));

        console.log(credential)

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