import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Guzergah } from '../models/guzergah';
import { ListResponseModel } from '../models/listResponseModel';
import { ResponseModel } from '../models/responseModel';

@Injectable({
  providedIn: 'root',
})
export class GuzergahService {
  private localGuzergah = environment.localUrl + '/guzergahlar';

  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<ListResponseModel<Guzergah>> {
    let newUrl = this.localGuzergah + '/getall';
    return this.httpClient.get<ListResponseModel<Guzergah>>(newUrl);
  }

  add(guzergah: Guzergah): Observable<ResponseModel> {
    let newUrl = this.localGuzergah + '/add';
    return this.httpClient.post<ResponseModel>(newUrl, guzergah);
  }

  delete(guzergah: Guzergah): Observable<ResponseModel> {
    let newUrl = this.localGuzergah + '/delete';
    return this.httpClient.post<ResponseModel>(newUrl, guzergah);
  }

  deleteAll(guzergah: Guzergah[]): Observable<ResponseModel> {
    let newUrl = this.localGuzergah + '/deleteall';
    return this.httpClient.post<ResponseModel>(newUrl, guzergah);
  }

  update(guzergah: Guzergah): Observable<ResponseModel> {
    let newUrl = this.localGuzergah + '/update';
    return this.httpClient.post<ResponseModel>(newUrl, guzergah);
  }
}
