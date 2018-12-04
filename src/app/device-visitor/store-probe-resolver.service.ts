import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {ProbeService} from '../probe/probe/probe.service';
import {WebSiteService} from '../web-site.service';
import {StoreService} from '../probe/store/store.service';
import {forkJoin} from 'rxjs/index';
import {ListData} from '../util/list-data';

// 预加载器,渲染组件前预先加载探针、历史探针以及门店信息
@Injectable({
  providedIn: 'root'
})
export class StoreProbeResolverService implements Resolve<ListData[]> {

  constructor(private probeService: ProbeService,
              private webSiteService: WebSiteService,
              private storeService: StoreService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ListData[]> {
    const post1 = this.probeService.listAll(this.webSiteService.getCurrentSelectedSite().value);
    const post2 = this.probeService.listHistory(this.webSiteService.getCurrentSelectedSite().value);
    const post0 = this.storeService.listAll(this.webSiteService.getCurrentSelectedSite().value);
    return forkJoin([post0, post1, post2]);
  }
}
