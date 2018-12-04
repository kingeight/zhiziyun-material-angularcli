import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Rx';
import {ListData} from '../util/list-data';
import {ActionResult} from '../util/action-result';

@Injectable({
  providedIn: 'root'
})
export class AdclickSegmentInfoService {

  constructor(private http: HttpClient) {
  }

  list(siteId: string, archived: number, name: string, page: number, rows: number): Observable<ListData> {
    return this.http.post<ListData>('/clickSegment/list.action', {
      siteId: siteId,
      archived: archived,
      name: name,
      page: page,
      rows: rows,
      sort: 'createTime',
      order: 'desc'
    }, {});
  }

  updateArchive(id: string): Observable<ActionResult> {
    return this.http.post<ActionResult>('/clickSegment/updateArchive.action', {id: id}, {});
  }

  getPlans(planIds: string): Observable<any []> {
    return this.http.post<any []>('/clickSegment/plans.action', {plans: planIds}, {});
  }

  activityList(siteId: string, page: number, name: string): Observable<any []> {
    return this.http.post<any []>('/clickSegment/activityList.action', {siteId: siteId, page: page, name: name}, {});
  }

  planList(activityId: string): Observable<any []> {
    return this.http.post<any []>('/clickSegment/planList.action', {activityId: activityId}, {});
  }

  add(siteId: string, name: string, plan: string, beginTime: string, endTime: string): Observable<ActionResult> {
    return this.http.post<ActionResult>('/clickSegment/add.action', {siteId: siteId, name: name, plan: plan, beginTime: beginTime + ' 00:00:01', endTime: endTime + ' 23:59:59'}, {});
  }
}
