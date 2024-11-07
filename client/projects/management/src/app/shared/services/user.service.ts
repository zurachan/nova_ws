import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'projects/management/src/environments/environment';
import { Observable, catchError, of, switchMap } from 'rxjs';

const urlApi = environment.apiUrl;
const endPoint = 'Users';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  GetPagingData(param: any): Observable<any[]> {
    return this.http.post(`${urlApi + endPoint}/search`, param).pipe(
      catchError((error) => {
        return of(error);
      }),
      switchMap((response) => {
        return of(response);
      })
    );
  }

  /** GET ONE: find exactly by id */
  GetById(id: number): Observable<any> {
    return this.http.get<any>(`${urlApi + endPoint}` + `/${id}`);
  }
  /** CREATE: add  new  */
  Insert(model: any): Observable<any> {
    return this.http.post<any>(`${urlApi + endPoint}`, model);
  }
  /** UPDATE: edit by id */
  Update(model: any): Observable<any> {
    return this.http.put<any>(`${urlApi + endPoint}` + `/${model.id}`, model);
  }
  /** DELETE: delete from the server by id */
  Delete(id: number): Observable<any> {
    return this.http.delete<any>(`${urlApi + endPoint}` + `/${id}`);
  }
}
