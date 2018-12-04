import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Rx';
import {ListData} from '../../util/list-data';
import {ActionResult} from '../../util/action-result';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor(private http: HttpClient) {
  }

  list(siteId: string, name: string, page: number, rows: number): Observable<ListData> {
    return this.http.post<ListData>('/probestore/list.action', {
      'siteId': siteId, 'name': name, 'page': page, 'rows': rows,
      'order': 'desc', 'sort': 'createTime'
    }, {});
  }

  listAll(siteId: string) {
    return this.http.post<ListData>('/probestore/listAll.action', {
      'siteId': siteId
    }, {});
  }

  insert(store: any): Observable<ActionResult> {
    return this.http.post<ActionResult>('/probestore/insert.action', store, {});

  }

  remove(id: number): Observable<ActionResult> {
    return this.http.post<ActionResult>('/probestore/delete.action', {id: id}, {});
  }

  update(store: any): Observable<ActionResult> {
    return this.http.post<ActionResult>('/probestore/update.action', store, {});
  }

  select(id: number): Observable<ActionResult> {
    return this.http.post<ActionResult>('/probestore/select.action', {id: id}, {});
  }

  queryLimitRegion(): Observable<ActionResult> {
    return this.http.post<ActionResult>('/probestore/queryLimitRegion.action', {}, {});
  }

  inLocation(addressComponents, limitLocations) {
    let result = false;
    try {
      if (!limitLocations) {
        result = true;
      } else {
        let limitCount = 0;
        for (const province in limitLocations) {
          if (addressComponents.province.indexOf(province) >= 0) {
            limitCount++;
            if (limitLocations[province][0] === '*') {
              result = true;
              break;
            } else {
              for (let i = 0; i < limitLocations[province].length; i++) {
                const regionIndex = limitLocations[province][i].indexOf('-');
                if (regionIndex > 0) {
                  const city = limitLocations[province][i].substr(0, regionIndex);
                  const region = limitLocations[province][i].substr(regionIndex + 1);
                  if (addressComponents.city.indexOf(city) >= 0 && addressComponents.district.indexOf(region) >= 0) {
                    result = true;
                  }
                } else {
                  if (addressComponents.city.indexOf(limitLocations[province][i]) >= 0) {
                    result = true;
                    break;
                  }
                }
              }
            }
          } else {
            limitCount++;
          }
        }
        if (limitCount === 0) {
          result = true;
        }
      }
    } catch (e) {
      console.log(e);
      result = false;
    }
    return result;
  }

}
