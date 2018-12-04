import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {ListData} from '../util/list-data';
import {HttpClient} from '@angular/common/http';
import {ActionResult} from '../util/action-result';
import {ReportMap} from '../util/report-map';

@Injectable({
  providedIn: 'root'
})
export class DeviceVisitorReportService {

  constructor(private http: HttpClient) {
  }

  deVisitHour(beginTime: string, endTime: string, microprobeId: number, storeId: number, siteId: string): Observable<ReportMap> {
    return this.http.post<ReportMap>('/dereport/deVisitHour.action',
      {beginTime: beginTime, endTime: endTime, microprobeId: microprobeId, storeId: storeId, siteId: siteId}, {});
  }

  deVisitAll(beginTime: string, endTime: string, microprobeId: number, storeId: number, siteId: string): Observable<ReportMap> {
    return this.http.post<ReportMap>('/dereport/deVisitAll.action',
      {beginTime: beginTime, endTime: endTime, microprobeId: microprobeId, storeId: storeId, siteId: siteId}, {});
  }

  deVisitType(beginTime: string, endTime: string, microprobeId: number, storeId: number, siteId: string, visitorType: string): Observable<ReportMap> {
    return this.http.post<ReportMap>('/dereport/deVisitType.action',
      {beginTime: beginTime, endTime: endTime, microprobeId: microprobeId, storeId: storeId, siteId: siteId, visitorType: visitorType}, {});
  }

  deVisitTypeList(beginTime: string, endTime: string, microprobeId: number,
                  storeId: number, siteId: string, page: number, rows: number, visitorType: string): Observable<ListData> {
    return this.http.post<ListData>('/dereport/deVisitTypeList.action',
      {
        beginTime: beginTime, endTime: endTime, microprobeId: microprobeId,
        storeId: storeId, siteId: siteId, page: page, rows: rows, visitorType: visitorType
      }, {});
  }

  deVisitActivity(beginTime: string, endTime: string, microprobeId: number, storeId: number, siteId: string, activity: string): Observable<ReportMap> {
    return this.http.post<ReportMap>('/dereport/deVisitActivity.action',
      {beginTime: beginTime, endTime: endTime, microprobeId: microprobeId, storeId: storeId, siteId: siteId, activity: activity}, {});
  }

  deVisitActivityList(beginTime: string, endTime: string, microprobeId: number, storeId: number, siteId: string, activity: string, page: number, rows: number): Observable<ListData> {
    return this.http.post<ListData>('/dereport/deVisitActivityList.action',
      {
        beginTime: beginTime, endTime: endTime, microprobeId: microprobeId,
        storeId: storeId, siteId: siteId, page: page, rows: rows, activity: activity
      }, {});
  }

  deVisitTimeLength(beginTime: string, endTime: string, microprobeId: number, storeId: number, siteId: string): Observable<ReportMap> {
    return this.http.post<ReportMap>('/dereport/deVisitTimeLength.action',
      {beginTime: beginTime, endTime: endTime, microprobeId: microprobeId, storeId: storeId, siteId: siteId}, {});
  }

  deVisitTimeLengthList(beginTime: string, endTime: string, microprobeId: number, storeId: number, siteId: string, page: number, rows: number): Observable<ListData> {
    return this.http.post<ListData>('/dereport/deVisitTimeLengthList.action',
      {beginTime: beginTime, endTime: endTime, microprobeId: microprobeId, storeId: storeId, siteId: siteId, page: page, rows: rows}, {});
  }

  deVisitAgeAndGender(beginTime: string, endTime: string, microprobeId: number, storeId: number, siteId: string): Observable<ReportMap> {
    return this.http.post<ReportMap>('/dereport/deVisitAgeAndGender.action',
      {beginTime: beginTime, endTime: endTime, microprobeId: microprobeId, storeId: storeId, siteId: siteId}, {});
  }

  deVisitBrandDevicePrice(beginTime: string, endTime: string, microprobeId: number, storeId: number, siteId: string): Observable<ReportMap> {
    return this.http.post<ReportMap>('/dereport/deVisitBrandDevicePrice.action',
      {beginTime: beginTime, endTime: endTime, microprobeId: microprobeId, storeId: storeId, siteId: siteId}, {});
  }
}
