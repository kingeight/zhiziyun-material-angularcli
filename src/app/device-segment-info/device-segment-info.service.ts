import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Rx';
import {ListData} from '../util/list-data';
import {ActionResult} from '../util/action-result';

@Injectable({
  providedIn: 'root'
})
export class DeviceSegmentInfoService {

  constructor(private http: HttpClient) {
  }

  list(siteId: string, archived: number, name: string, page: number, rows: number): Observable<ListData> {
    return this.http.post<ListData>('proxy/deviceSegmentInfo/list.action', {
      siteId: siteId,
      archived: archived,
      name: name,
      page: page,
      rows: rows,
      sort: 'CreateTime',
      order: 'desc'
    }, {});
  }

  updateArchive(id: string): Observable<ActionResult> {
    return this.http.post<ActionResult>('proxy/deviceSegmentInfo/updateArchive.action', {id: id}, {});
  }

  forceEnd(id: string): Observable<ActionResult> {
    return this.http.post<ActionResult>('proxy/deviceSegmentInfo/forceEnd.action', {id: id}, {});
  }

  queryTags(): Observable<ListData> {
    return this.http.post<ListData>('proxy/deviceSegmentInfo/queryTags.action', {}, {});
  }

  queryAgentId(): Observable<ActionResult> {
    return this.http.post<ActionResult>('proxy/deviceSegmentInfo/queryAgentId.action', {}, {});
  }

  insert(data: any): Observable<ActionResult> {
    return this.http.post<ActionResult>('proxy/deviceSegmentInfo/insert.action', data, {});
  }

  queryById(id: number): Observable<ActionResult> {
    return this.http.post<ActionResult>('proxy/deviceSegmentInfo/queryById.action', {id: id}, {});
  }

}
