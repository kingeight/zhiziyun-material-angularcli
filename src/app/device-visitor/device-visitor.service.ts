import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {ListData} from '../util/list-data';
import {HttpClient} from '@angular/common/http';
import {ActionResult} from '../util/action-result';

@Injectable({
  providedIn: 'root'
})
export class DeviceVisitorService {

  constructor(private http: HttpClient) {
  }

  list(data): Observable<ListData> {
    return this.http.post<ListData>('proxy/deviceVisit/list.action', data, {});
  }

  queryDemoSupport(siteId: string): Observable<ActionResult> {
    return this.http.post<ActionResult>('proxy/deviceVisit/queryDemoSupport.action', {siteId: siteId}, {});
  }

  queryDeviceToDemo(siteId: string, mac: string): Observable<ActionResult> {
    return this.http.post<ActionResult>('proxy/deviceVisit/queryDeviceToDemo.action', {siteId: siteId, mac: mac}, {});
  }

  addToDemo(siteId: string, mac: string): Observable<ActionResult> {
    return this.http.post<ActionResult>('proxy/deviceVisit/addDeviceToDemo.action', {siteId: siteId, mac: mac}, {});
  }

  deleteToDemo(siteId: string, mac: string): Observable<ActionResult> {
    return this.http.post<ActionResult>('proxy/deviceVisit/deleteDeviceToDemo.action', {siteId: siteId, mac: mac}, {});
  }

  queryTags(mac: string): Observable<any> {
    return this.http.post<any>('proxy/deviceVisit/queryTags.action', {mac: mac}, {});
  }

  queryIcons(ids: string): Observable<ListData> {
    return this.http.post<ListData>('proxy/deviceVisit/queryIcons.action', {ids: ids}, {});
  }
}
