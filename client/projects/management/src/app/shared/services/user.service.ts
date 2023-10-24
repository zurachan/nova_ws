import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const urlApi = 'https://localhost:44322/api/';
const currentData = 'Authentication';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  Login(model: any) {
    return this.http.post(`${urlApi}` + `${currentData}` + "/Login", model);
  }
}
