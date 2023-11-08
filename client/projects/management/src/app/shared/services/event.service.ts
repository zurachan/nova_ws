import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of, switchMap } from 'rxjs';
const urlApi = 'https://localhost:44322/api/Events';
@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient) { }

  GetAll(param: any): Observable<any[]> {
    return this.http.post(`${urlApi}/search`, param).pipe(catchError((error) => {
      return of(error);
    }), switchMap((response) => {
      return of(response);
    }));
  }
  /** GET ONE: find exactly by id */
  GetById(id: number): Observable<any> {
    return this.http.get<any>(`${urlApi}` + `/${id}`).pipe();
  }
  /** CREATE: add  new  */
  Insert(model: any): Observable<any> {
    return this.http.post<any>(`${urlApi}`, model).pipe();
  }
  /** UPDATE: edit by id */
  Update(model: any): Observable<any> {
    return this.http.put<any>(`${urlApi}` + `/${model.id}`, model).pipe();
  }
  /** DELETE: delete from the server by id */
  Delete(id: number): Observable<any> {
    return this.http.delete<any>(`${urlApi}` + `/${id}`).pipe();
  }
}
