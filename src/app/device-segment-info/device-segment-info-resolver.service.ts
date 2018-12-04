import {Injectable} from '@angular/core';
import {WebSiteService} from '../web-site.service';
import {ProbeService} from '../probe/probe/probe.service';
import {DeviceSegmentInfoService} from './device-segment-info.service';
import {forkJoin} from 'rxjs/index';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Rx';


@Injectable({
  providedIn: 'root'
})
export class DeviceSegmentInfoResolverService implements Resolve<any []> {

  constructor(private probeService: ProbeService,
              private webSiteService: WebSiteService,
              private deviceSegmentInfoService: DeviceSegmentInfoService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any[]> {
    const post1 = this.probeService.listAll(this.webSiteService.getCurrentSelectedSite().value);
    const post2 = this.probeService.listHistory(this.webSiteService.getCurrentSelectedSite().value);
    const post3 = this.deviceSegmentInfoService.queryTags();
    const post4 = this.deviceSegmentInfoService.queryAgentId();
    const segmentId = +route.paramMap.get('segmentId');
    if (segmentId) {
      const post5 = this.deviceSegmentInfoService.queryById(segmentId);
      return forkJoin([post1, post2, post3, post4, post5]);
    } else {
      return forkJoin([post1, post2, post3, post4]);
    }
  }
}
