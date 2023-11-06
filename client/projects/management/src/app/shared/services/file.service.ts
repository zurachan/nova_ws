import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const urlApi = 'https://localhost:44322/api/File';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) { }

  getImage(param: any): Observable<any> {
    return this.http.get<any>(`${urlApi}` + '/DownloadItemFile?itemId=' + `${param.itemId}` + "&itemType=" + `${param.itemType}`).pipe();
  }

}
