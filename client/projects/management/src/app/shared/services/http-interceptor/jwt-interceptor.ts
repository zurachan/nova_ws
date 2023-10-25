import { AuthenticateService } from '../authenticate.service';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authService: AuthenticateService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add auth header with jwt if user is logged in and request is to api url
        let isLoggedIn = this.authService.LoggedIn;
        let currentUser = this.authService.GetCredential;
        let isApiUrl = request.url.startsWith("https://localhost:44322/api/");
        if (isLoggedIn && isApiUrl) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${currentUser.token}`
                }
            });
        }

        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
                this.authService.Logout();
            }
            return throwError(() => err);
        }));
    }
}

