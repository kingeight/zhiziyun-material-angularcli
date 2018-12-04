import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Rx';
import {WebSiteService} from '../web-site.service';
import {WifiSegmentInfoService} from './wifi-segment-info.service';
import {PageEvent} from '@angular/material';

@Component({
  selector: 'app-wifi-segment-info',
  templateUrl: './wifi-segment-info.component.html',
  styleUrls: ['./wifi-segment-info.component.scss']
})
export class WifiSegmentInfoComponent implements OnInit, OnDestroy {

  subscription: Subscription;

  searchText = ''; // 搜索文字

  list: any[]; // 列表数据
  page = 0;
  rows = 10;
  total = 0;

  displayedColumns = ['id', 'name', 'count', 'createTime'];

  constructor(private webSiteService: WebSiteService,
              private wifiSegmentInfoService: WifiSegmentInfoService) {
    this.subscription = this.webSiteService.getMessage().subscribe(site => { // 所选网站变化事件，所有跟site相关的数据都应该在这里执行
      // 初始化数据
      this.initData();
    });
  }

  ngOnInit() {
    this.initData();
  }

  initData() {
    this.getList();
  }

  search() {
    this.page = 0;
    this.getList();
  }

  getList(e: PageEvent = null) {
    if (e != null) {
      this.page = e.pageIndex;
      this.rows = e.pageSize;
    }
    this.wifiSegmentInfoService.list(this.webSiteService.getCurrentSelectedSite().value,
      this.searchText, this.page + 1, this.rows)
      .subscribe(res => {
        this.list = res.rows;
        this.total = res.total;
      });
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

}
