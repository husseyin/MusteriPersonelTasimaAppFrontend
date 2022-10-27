import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ListResponseModel } from '../models/listResponseModel';
import { ResponseModel } from '../models/responseModel';
import { Sofor } from '../models/sofor';

@Injectable({
  providedIn: 'root',
})
export class SoforService {
  private localSofor = environment.localUrl + '/soforler';

  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<ListResponseModel<Sofor>> {
    let newUrl = this.localSofor + '/getall';
    return this.httpClient.get<ListResponseModel<Sofor>>(newUrl);
  }

  add(sofor: Sofor): Observable<ResponseModel> {
    let newUrl = this.localSofor + '/add';
    return this.httpClient.post<ResponseModel>(newUrl, sofor);
  }

  delete(sofor: Sofor): Observable<ResponseModel> {
    let newUrl = this.localSofor + '/delete';
    return this.httpClient.post<ResponseModel>(newUrl, sofor);
  }

  deleteAll(sofor: Sofor[]): Observable<ResponseModel> {
    let newUrl = this.localSofor + '/deleteall';
    return this.httpClient.post<ResponseModel>(newUrl, sofor);
  }

  update(sofor: Sofor): Observable<ResponseModel> {
    let newUrl = this.localSofor + '/update';
    return this.httpClient.post<ResponseModel>(newUrl, sofor);
  }
}
