import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Rx';
import {WebSiteService} from '../../web-site.service';
import {StoreService} from '../../probe/store/store.service';
import {ProbeService} from '../../probe/probe/probe.service';
import {forkJoin} from 'rxjs/index';

@Component({
  selector: 'app-device-visitor-attribute',
  templateUrl: './device-visitor-attribute.component.html',
  styleUrls: ['./device-visitor-attribute.component.scss']
})
export class DeviceVisitorAttributeComponent implements OnInit, OnDestroy {

  subscription: Subscription;

  stores: any[]; // 门店集合

  probes: any[]; // 探针集合

  sencondActived = false;

  constructor(private storeService: StoreService,
              private probeService: ProbeService,
              private webSiteService: WebSiteService) {
    this.subscription = this.webSiteService.getMessage().subscribe(site => { // 所选网站变化事件，所有跟site相关的数据都应该在这里执行
      // 初始化数据
      this.initData();
    });
  }

  ngOnInit() {
    this.initData();
  }

  tabChange(index: number) {
    if (index === 1) {
      this.sencondActived = true;
    }
  }

  initData() {
    this.stores = [{name: '全部', id: undefined}];
    this.probes = [{name: '全部', id: undefined}];
    const post0 = this.storeService.listAll(this.webSiteService.getCurrentSelectedSite().value);
    const post1 = this.probeService.listAll(this.webSiteService.getCurrentSelectedSite().value);
    forkJoin([post0, post1])
      .subscribe(res => {
        this.stores = this.stores.concat(res[0].rows);
        this.probes = this.probes.concat(res[1].rows);
      });
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

}
