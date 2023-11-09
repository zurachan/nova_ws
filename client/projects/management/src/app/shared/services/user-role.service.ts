import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of, switchMap } from 'rxjs';
const urlApi = 'https://localhost:44322/api/UserRoles';
@Injectable({
  providedIn: 'root'
})
export class UserRoleService {

  constructor(private http: HttpClient) { }

  GetAllUserRoles(): Observable<any[]> {
    return this.http.get(`${urlApi}`).pipe(catchError((error) => {
      return of(error);
    }), switchMap((response) => {
      return of(response);
    }));
  }

  SaveUserRoles(model: any): Observable<any> {
    return this.http.post<any>(`${urlApi}`, model).pipe();
  }
}
