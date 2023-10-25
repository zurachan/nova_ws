import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
const urlApi = 'https://localhost:44322/api/Projects';
@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient) { }

  GetAll(): Observable<any[]> {
    return this.http.get<any[]>(`${urlApi}`).pipe();
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
