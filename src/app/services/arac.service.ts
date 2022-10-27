import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Arac } from '../models/arac';
import { HttpClient } from '@angular/common/http';
import { ResponseModel } from '../models/responseModel';
import { ListResponseModel } from '../models/listResponseModel';

@Injectable({
  providedIn: 'root',
})
export class AracService {
  private localArac = environment.localUrl + '/araclar';

  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<ListResponseModel<Arac>> {
    let newUrl = this.localArac + '/getall';
    return this.httpClient.get<ListResponseModel<Arac>>(newUrl);
  }

  add(arac: Arac): Observable<ResponseModel> {
    let newUrl = this.localArac + '/add';
    return this.httpClient.post<ResponseModel>(newUrl, arac);
  }

  delete(arac: Arac): Observable<ResponseModel> {
    let newUrl = this.localArac + '/delete';
    return this.httpClient.post<ResponseModel>(newUrl, arac);
  }

  deleteAll(arac: Arac[]): Observable<ResponseModel> {
    let newUrl = this.localArac + '/deleteall';
    return this.httpClient.post<ResponseModel>(newUrl, arac);
  }

  update(arac: Arac): Observable<ResponseModel> {
    let newUrl = this.localArac + '/update';
    return this.httpClient.post<ResponseModel>(newUrl, arac);
  }
}
