import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, of, switchMap } from 'rxjs';

const urlApi = 'https://localhost:44322/api/File';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) { }

  uploadFile(param: any) {
    return this.http.post(`${urlApi}/PostSingleFile`, param).pipe(catchError((error) => {
      return of(error);
    }), switchMap((response) => {
      return of(response);
    }));
  }

  // uploadMultiFile(param: any) {
  //   return this.http.post(`${urlApi}/PostMultipleFile`, param).pipe(catchError((error) => {
  //     return of(error);
  //   }), switchMap((response) => {
  //     return of(response);
  //   }));
  // }

  // getImage(param: any): Observable<any> {
  //   return this.http.get<any>(`${urlApi}/DownloadItemFile?itemId=${param.itemId}&itemType=${param.itemType}`).pipe();
  // }

}