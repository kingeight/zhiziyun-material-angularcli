import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Rx';
import {ListData} from '../../util/list-data';
import {ActionResult} from '../../util/action-result';

@Injectable({
  providedIn: 'root'
})
export class ProbeService {

  constructor(private http: HttpClient) {
  }

  list(storeId: number, siteId: string, name: string, page: number, rows: number, docked: boolean): Observable<ListData> {
    const body = {
      'storeId': storeId, 'siteId': siteId, 'name': name || '', 'page': page, 'rows': rows,
      'order': 'desc', 'sort': 'createTime', 'docked': docked
    };
    if (docked === null || typeof docked === 'undefined') {
      delete body['docked'];
    }
    return this.http.post<ListData>('proxy/microProbe/list.action', body, {});
  }

  listAll(siteId: string): Observable<ListData> {
    return this.http.post<ListData>('proxy/microProbe/listAll.action', {
      'siteId': siteId
    }, {});
  }

  listHistory(siteId: string): Observable<ListData> {
    return this.http.post<ListData>('proxy/microProbe/listHistory.action', {
      'siteId': siteId
    }, {});
  }

  toggleStatus(id: number): Observable<ActionResult> {
    return this.http.post<ActionResult>('proxy/microProbe/toggleStatus.action', {id: id}, {});
  }

  update(probe: any): Observable<ActionResult> {
    return this.http.post<ActionResult>('proxy/microProbe/update.action', probe, {});
  }

  unbind(id: number): Observable<ActionResult> {
    return this.http.post<ActionResult>('proxy/microProbe/delete.action', {id: id}, {});
  }

  add(probe: any): Observable<ActionResult> {
    return this.http.post<ActionResult>('proxy/microProbe/insert.action', probe, {});
  }

  getSignalFromRadius(radius: number): number {
    const domain = [1.47, 1.62, 1.78, 1.96, 2.15, 2.37, 2.61, 2.87, 3.16, 3.48, 3.83,
      4.22, 4.64, 5.11, 5.62, 6.19, 6.81, 7.50, 8.25, 9.09, 10.00, 11.01, 12.12,
      13.34, 14.68, 16.16, 17.78, 19.57, 21.54, 23.71, 26.10, 28.73, 31.62,
      34.81, 38.31, 42.17, 46.42, 51.09, 56.23, 61.90, 68.13, 74.99, 82.54, 90.85];
    const signal = [56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73,
      74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 96, 98, 99];
    let index = 0;
    for (let i = 0; i < domain.length; i++) {
      index = i;
      if (domain[i] > radius) {
        break;
      }
    }
    if (index === domain.length - 1) {
      return 99;
    }
    if (index === 0) {
      return 56;
    }
    return signal[index - 1];
  }

  getRange(rssi: number) {
    if (!rssi) {
      return '未知';
    }
    if (rssi > 99) {
      return '大于90米';
    }
    if (rssi < 56) {
      return '小于1米';
    }
    const domain = [1.47, 1.62, 1.78, 1.96, 2.15, 2.37, 2.61, 2.87, 3.16, 3.48, 3.83,
      4.22, 4.64, 5.11, 5.62, 6.19, 6.81, 7.50, 8.25, 9.09, 10.00, 11.01, 12.12,
      13.34, 14.68, 16.16, 17.78, 19.57, 21.54, 23.71, 26.10, 28.73, 31.62,
      34.81, 38.31, 42.17, 46.42, 51.09, 56.23, 61.90, 68.13, 74.99, 82.54, 90.85];
    const range = [56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73,
      74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 96, 98, 99];
    for (let i = 0; i < range.length; i++) {
      if (range[i] <= rssi && rssi <= range[i + 1]) {
        return domain[i] + '米至' + domain[i + 1] + '米';
      }
    }
  }
}
