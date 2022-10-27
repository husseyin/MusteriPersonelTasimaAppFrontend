import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ListResponseModel } from '../models/listResponseModel';
import { ResponseModel } from '../models/responseModel';
import { SingleResponseModel } from '../models/singleResponseModel';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private localUser = environment.localUrl + '/users';

  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<ListResponseModel<User>> {
    let newUrl = this.localUser + '/getall';
    return this.httpClient.get<ListResponseModel<User>>(newUrl);
  }

  add(user: User): Observable<ResponseModel> {
    let newUrl = this.localUser + '/add';
    return this.httpClient.post<ResponseModel>(newUrl, user);
  }

  delete(user: User): Observable<ResponseModel> {
    let newUrl = this.localUser + '/delete';
    return this.httpClient.post<ResponseModel>(newUrl, user);
  }

  deleteAll(user: User[]): Observable<ResponseModel> {
    let newUrl = this.localUser + '/deleteall';
    return this.httpClient.post<ResponseModel>(newUrl, user);
  }

  update(user: User): Observable<ResponseModel> {
    let newUrl = this.localUser + '/update';
    return this.httpClient.post<ResponseModel>(newUrl, user);
  }

  validUser(
    username: string,
    password: string
  ): Observable<ListResponseModel<any>> {
    let newPath =
      this.localUser +
      '/validuser?username=' +
      username +
      '&password=' +
      password;
    return this.httpClient.get<ListResponseModel<any>>(newPath);
  }

  isLogin(): boolean {
    if (localStorage.getItem('token')) {
      return true;
    } else {
      return false;
    }
  }

  getByUsername(username: string): Observable<SingleResponseModel<User>> {
    let newPath = this.localUser + '/getbyusername?username=' + username;
    return this.httpClient.get<SingleResponseModel<User>>(newPath);
  }
}
