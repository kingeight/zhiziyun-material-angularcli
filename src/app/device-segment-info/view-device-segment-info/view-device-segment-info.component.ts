import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Rx';
import {WebSiteService} from '../../web-site.service';
import {ActivatedRoute, Router} from '@angular/router';
import * as _ from 'underscore';
import {FormArray, FormControl} from '@angular/forms';

declare const $: any;

@Component({
  selector: 'app-view-device-segment-info',
  templateUrl: './view-device-segment-info.component.html',
  styleUrls: ['./view-device-segment-info.component.scss']
})
export class ViewDeviceSegmentInfoComponent implements OnInit, OnDestroy {

  subscription: Subscription;

  segment: any; // 人群对象

  probes: any[]; // 可选探针集合

  visitorTypes = [ // 访客类型
    {
      name: '所有访客',
      value: -1
    },
    {
      name: '老访客',
      value: 0
    },
    {
      name: '新访客',
      value: 1
    }
  ];
  activities = [{ // 用户活跃度
    name: '高活跃',
    value: '3'
  },
    {
      name: '中活跃',
      value: '2'
    },
    {
      name: '低活跃',
      value: '1'
    },
    {
      name: '沉睡',
      value: '0'
    }
  ];

  selectedDate: any[]; // 选中的日期范围

  oses = [{name: 'IOS', value: 0}, {name: '安卓', value: 1}]; // 可选操作系统

  phoneBrands = [ // 可选手机品牌
    {name: '苹果', value: '苹果', type: 0},
    {name: '华为', value: '华为', type: 1},
    {name: '三星', value: '三星', type: 1},
    {name: 'OPPO', value: 'OPPO', type: 1},
    {name: 'VIVO', value: 'VIVO', type: 1},
    {name: '小米', value: '小米', type: 1},
    {name: '魅族', value: '魅族', type: 1},
    {name: '索尼', value: '索尼', type: 1}
  ];

  allTags: any[]; // 所有标签
  filtedTags: any[]; // 过滤后的标签

  agentId: number;

  minStayDuration: number;
  maxStayDuration: number;
  selectedStayDuration: number;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private webSiteService: WebSiteService) {
    this.subscription = this.webSiteService.getMessage().subscribe(site => { // 所选网站变化事件，所有跟site相关的数据都应该在这里执行
      this.router.navigate(['/devicesegmentinfo']);
    });
  }

  ngOnInit() {
    this.route.data.subscribe((res: { resolveData: any[] }) => {
      this.probes = res.resolveData[0].rows;
      this.probes = res.resolveData[1].rows.reduce(function (p, c) {
        const even = _.find(p, function (probe) {
          return probe['mac'] === c.mac;
        });
        if (!even) {
          c.history = true;
          p = p.concat(c);
        }
        return p;
      }, this.probes);
      this.allTags = res.resolveData[2].rows;
      this.agentId = res.resolveData[3].obj;
      if (this.agentId !== 265) {
        this.filtedTags = this.allTags.filter(x => x['dtype'] !== 'game' && x['dtype'] !== 'app');
      } else {
        this.filtedTags = this.allTags
      }
      this.segment = res.resolveData[4].obj;
      this.selectedDate = [this.segment['beginTime'], this.segment['endTime']];
      this.selectedStayDuration = 1;
      this.minStayDuration = this.segment['minStayDuration'];
      this.maxStayDuration = this.segment['maxStayDuration'];
      if (this.segment['stayDuration'] === 0) {
        this.minStayDuration = 0;
        this.maxStayDuration = 10;
      } else if (this.segment['stayDuration'] === 1) {
        this.minStayDuration = 10;
        this.maxStayDuration = 30;
      } else if (this.segment['stayDuration'] === 2) {
        this.minStayDuration = 30;
        this.maxStayDuration = 60;
      } else if (this.segment['stayDuration'] === 3) {
        this.minStayDuration = 60;
        this.maxStayDuration = 120;
      } else if (this.segment['stayDuration'] === 4) {
        this.minStayDuration = 120;
        this.maxStayDuration = 180;
      } else if (this.segment['stayDuration'] === 5) {
        this.minStayDuration = 180;
        this.maxStayDuration = null;
      } else if (!this.segment['minStayDuration'] && !this.segment['maxStayDuration']) {
        this.selectedStayDuration = 0;
      }
    });
  }

  probeChecked(mac: string): boolean {
    if (this.segment['probes'].indexOf(mac) > -1) {
      return true;
    } else {
      return false;
    }
  }

  visitorTypeChecked(visitorType: number): boolean {
    if (this.segment['visitorType'] === visitorType) {
      return true;
    } else {
      return false;
    }
  }

  activityChecked(activity: number): boolean {
    if ($.inArray(activity, this.segment['activity'].split('\|')) > -1) {
      return true;
    } else {
      return false;
    }
  }

  osChecked(os: number): boolean {
    if (this.segment['os'] === 'imei' && os === 1) {
      return true;
    } else if (this.segment['os'] === 'idfa' && os === 0) {
      return true;
    } else {
      return false;
    }
  }


  brandChecked(brand: string): boolean {
    if ($.inArray(brand, this.segment['phoneBrand'].split(',')) > -1) {
      return true;
    } else {
      return false;
    }
  }

  tagChecked(id: string): boolean {
    if ($.inArray(id + '', this.segment['tags'].split('\|')) > -1) {
      return true;
    } else {
      return false;
    }
  }


  brandShow(i: number): boolean {
    if (this.segment['os']) {
      return true;
    }
    if (this.segment['os'] === 'imei' && i === 1) {
      return true;
    } else if (this.segment['os'] === 'idfa' && i === 0) {
      return true;
    }
    return false;
  }

  filteTags(tags: any []) {
    const that = this;
    return tags.filter(function (item) {
      if (that.agentId !== 265) {
        return (item.name.indexOf('性别') > -1 || item.name.indexOf('年龄') > -1)
      } else {
        return item;
      }
    });
  };

  stopPropagation(event) { // 防止点击事件冒泡
    event.stopPropagation();
  }

  finish() {
    this.router.navigate(['/devicesegmentinfo']);
  }


  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }
}
