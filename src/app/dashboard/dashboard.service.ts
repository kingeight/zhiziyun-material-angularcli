import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

import * as moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {

    constructor(private http: HttpClient) {
    }

    // 获取网站客流量信息
    getCount(siteId: string): Observable<any> {
        return this.http.post('/board/count.action', {siteId: siteId}, {});
    }

    // 获取所有网站探针
    getProbes(siteId: string): Observable<any> {
        return this.http.post('/board/initProbe.action', {siteId: siteId}, {});
    }

    // 获取小时趋势数据
    getVisitCount(siteId: string, microprobeId: string): Observable<any> {
        return this.http.post('/board/deVisitHour.action',
            {
                siteId: siteId, microprobeId: microprobeId,
                beginTime: moment().format('YYYY-MM-DD'),
                endTime: moment().format('YYYY-MM-DD')
            }, {});
    }
}
