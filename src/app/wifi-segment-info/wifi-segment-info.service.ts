import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Rx';
import {ListData} from '../util/list-data';

@Injectable({
  providedIn: 'root'
})
export class WifiSegmentInfoService {

  constructor(private http: HttpClient) { }

  list(siteId: string,  name: string, page: number, rows: number): Observable<ListData> {
    return this.http.post<ListData>('/segmentWifi/list.action', {
      siteId: siteId,
      name: name,
      page: page,
      rows: rows,
      sort: 'updateTime',
      order: 'desc'
    }, {});
  }
}
