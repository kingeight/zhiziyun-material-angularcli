import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {StoreService} from '../probe/store/store.service';
import {WebSiteService} from '../web-site.service';
import {Subscription} from 'rxjs/Rx';
import {ProbeService} from '../probe/probe/probe.service';
import {forkJoin, interval} from 'rxjs/index';
import {DeviceVisitorService} from './device-visitor.service';
import * as _ from 'underscore';
import * as moment from 'moment';
import * as d3 from 'd3';
import * as $ from 'jquery';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, PageEvent} from '@angular/material';
import {ListData} from '../util/list-data';
import {Coordinate} from '../util/coordinate';
import {take} from 'rxjs/internal/operators';
import {Observable} from 'rxjs/Rx';
import {map} from 'rxjs/internal/operators';
import swal from 'sweetalert2';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import {Overlay} from '@angular/cdk/overlay';
import {NotificationService} from '../util/notification/notification.service';

@Component({
  selector: 'app-device-visitor',
  templateUrl: './device-visitor.component.html',
  styleUrls: ['./device-visitor.component.scss'],
  animations: [ // 定义动画效果，用于滚动动画
    trigger('shrinkOut', [
      state('in', style({height: '*'})),
      transition(':leave', [
        style({height: '*'}),
        animate(250, style({height: 0}))
      ]),
      transition(':enter', [
        style({opacity: 0}),
        animate(250, style({opacity: 1}))
      ])
    ])
  ]
})
export class DeviceVisitorComponent implements OnInit, OnDestroy {

  subscription: Subscription;

  stores: any[];
  selectedStore: number;

  probes: any[];
  selectedProbe: string;

  searchMac: string; // 待搜索的完整mac地址

  selectedDate: string[];

  page = 0;
  rows = 10;
  total = 0;
  order = 'desc'; // 排序方式
  sort = 'visittime'; // 排序字段

  deviceVisitors: any[]; // 列表显示的访客集合

  points: Coordinate[]; // 渲染地图需要的探针位置集合
  radarPoints: any[]; // 雷达上渲染的点
  devices = []; // 雷达上的设备
  radarSubsciption: Subscription; // 雷达上广点渲染计数器，注意：切换广告主或者重新搜索时需要重置

  sliderItems = []; // 滚动元素集合
  sliderSubscription: Subscription; // 滚动计时器，注意:切换广告主或者重新搜索时需要重置计数器

  displayedColumns: any[] = ['storeName', 'probeName', 'mac', 'is_new', 'brand', 'visittime', 'range', 'actions'];

  constructor(private webSiteService: WebSiteService,
              private storeService: StoreService,
              private probeService: ProbeService,
              private deviceVisitorService: DeviceVisitorService,
              private route: ActivatedRoute,
              public dialog: MatDialog, private overlay: Overlay) {
    this.subscription = this.webSiteService.getMessage().subscribe(site => { // 所选网站变化事件，所有跟site相关的数据都应该在这里执行
      // 初始化数据
      this.reInitData();
    });
    this.selectedDate = [moment().format('YYYY-MM-DD') + ' 00:00:00', moment().format('YYYY-MM-DD') + ' 23:59:59'];
  }

  ngOnInit() {
    this.stores = [{id: undefined, name: '全部'}];
    this.probes = [{mac: undefined, name: '全部'}];
    this.route.data
      .subscribe((res: { list: ListData[] }) => {
        this.stores = this.stores.concat(res.list[0].rows);
        this.probes = this.probes.concat(res.list[1].rows);
        this.probes = res.list[2].rows.reduce(function (p, c) {
          const even = _.find(p, function (probe) {
            return probe['mac'] === c.mac;
          });
          if (!even) {
            c.history = true;
            c.name = c.name + '(已解绑)';
            p = p.concat(c);
          }
          return p;
        }, this.probes);
      });
    this.initData();
  }

  // 初始化数据
  initData() {
    this.getPoints();
    this.getTableList();
    this.getRadarData();
  }

  // 更新网站信息后重新初始化数据
  reInitData() {
    this.searchMac = '';
    this.page = 1;
    this.selectedStore = undefined;
    this.selectedProbe = undefined;
    this.stores = [{id: undefined, name: '全部'}];
    this.probes = [{mac: undefined, name: '全部'}];
    this.deviceVisitors = [];
    this.points = [];
    this.devices = [];

    const post0 = this.storeService.listAll(this.webSiteService.getCurrentSelectedSite().value);
    const post1 = this.probeService.listAll(this.webSiteService.getCurrentSelectedSite().value);
    const post2 = this.probeService.listHistory(this.webSiteService.getCurrentSelectedSite().value);
    forkJoin([post0, post1, post2])
      .subscribe(res => {
        this.stores = this.stores.concat(res[0].rows);
        this.probes = this.probes.concat(res[1].rows);
        this.probes = res[2].rows.reduce(function (p, c) {
          const even = _.find(p, function (probe) {
            return probe['mac'] === c.mac;
          });
          if (!even) {
            c.history = true;
            c.name = c.name + '(已解绑)';
            p = p.concat(c);
          }
          return p;
        }, this.probes);
        this.getPoints();
        this.getTableList();
        this.getRadarData();
      })
  }

  search() {
    this.getTableList();
  }

  storeChange() {
    this.getPoints();
    this.getTableList();
    this.getRadarData();
  }

  probeChange() {
    this.getPoints();
    this.getTableList();
    this.getRadarData();
  }

  timeChange() {
    this.getTableList();
    this.getRadarData();
  }

  // 获取雷达数据并渲染雷达
  getRadarData() {
    if (this.sliderSubscription != null) { // 重置滚动计数器
      this.sliderSubscription.unsubscribe();
    }
    if (this.radarSubsciption != null) {
      this.radarSubsciption.unsubscribe(); // 重置计数器
    }
    this.radarPoints = [];
    const params = {};
    params['page'] = 1;
    params['rows'] = 150;
    params['starttime'] = this.selectedDate[0];
    params['endtime'] = this.selectedDate[1];
    params['siteId'] = this.webSiteService.getCurrentSelectedSite().value;
    if (this.searchMac) {
      params['dmac'] = this.searchMac;
    }
    if (this.selectedProbe) {
      params['macs'] = [this.selectedProbe];
    }
    if (this.selectedStore) {
      params['storeId'] = this.selectedStore;
    }
    params['sort'] = this.sort;
    params['order'] = this.order;
    this.deviceVisitorService.list(params)
      .subscribe(list => {
        this.radarPoints = this.serializ(list.rows);
        this.total = list.total;
        this.renderRadar();
        this.renderSlider();
      });
  }

  // 获取列表页数据
  getTableList(e: PageEvent = null) {
    if (e != null) {
      this.page = e.pageIndex;
      this.rows = e.pageSize;
    }
    const params = {};
    params['page'] = this.page + 1;
    params['rows'] = this.rows;
    params['starttime'] = this.selectedDate[0];
    params['endtime'] = this.selectedDate[1];
    params['siteId'] = this.webSiteService.getCurrentSelectedSite().value;
    if (this.searchMac) {
      params['dmac'] = this.searchMac;
    }
    if (this.selectedProbe) {
      params['macs'] = [this.selectedProbe];
    }
    if (this.selectedStore) {
      params['storeId'] = this.selectedStore;
    }
    params['sort'] = this.sort;
    params['order'] = this.order;
    this.deviceVisitorService.list(params)
      .subscribe(list => {
        this.deviceVisitors = this.serializ(list.rows);
        this.total = list.total;
      });
  }

  // 序列化数据以便显示门店名称和探针名称
  serializ(items: any[]): any[] {
    const that = this;
    items.forEach(function (item, index) {
      item.range = that.probeService.getRange(item.rssi);
      for (const i in that.probes) {
        if (item.probemac === that.probes[i].mac) {
          item.probeName = that.probes[i].name;
          for (const j in that.stores) {
            if (that.probes[i].storeId === that.stores[j].id) {
              if (item['storename']) {
                item.storeName = item['storename'];
              } else {
                item.storeName = that.stores[j].name;
              }
            }
          }
        }
      }
    });
    return items;
  };

  getPoints() {
    this.points = [];
    if (this.selectedProbe) {
      for (let i = 0; i < this.probes.length; i++) {
        if (this.probes[i]['latitude'] && this.probes[i]['mac'] === this.selectedProbe) {
          const coo = new Coordinate(this.probes[i]['latitude'], this.probes[i]['longitude']);
          this.points.push(coo);
        }
      }
    } else if (this.selectedStore) {
      for (let i = 0; i < this.probes.length; i++) {
        if (this.probes[i]['latitude'] && this.probes[i]['storeId'] === this.selectedStore) {
          const coo = new Coordinate(this.probes[i]['latitude'], this.probes[i]['longitude']);
          this.points.push(coo);
        }
      }
    } else {
      for (let i = 0; i < this.probes.length; i++) {
        if (this.probes[i]['latitude']) {
          const coo = new Coordinate(this.probes[i]['latitude'], this.probes[i]['longitude']);
          this.points.push(coo);
        }
      }
    }
  }

  // 渲染雷达
  renderRadar() {
    const maxrssi = d3.max(this.radarPoints, function (item) {
      return item.rssi;
    });
    const ary = [];
    ary.push(this.total);
    this.radarPoints.forEach(function (item, index) {
      const r = (1 - Math.random() * 0.5) * 200 * item.rssi / maxrssi;
      const cx = Math.random() * r * (Math.random() > 0.5 ? 1 : -1);
      const cy = Math.sqrt(r * r - cx * cx) * (Math.random() > 0.5 ? 1 : -1);
      item.cx = cx;
      item.cy = cy;
    });
    d3.select('#radar').selectAll('svg').remove();
    const g = d3.select('#radar')
      .append('svg')
      .attr('width', 400)
      .attr('height', 400)
      .append('g').attr('transform', 'translate(200,200)');
    g.selectAll('text').remove();
    g.selectAll('text')
      .data(ary)
      .enter()
      .append('text')
      .attr('x', 0)
      .attr('y', 0)
      .style('fill', 'white').style('font-size', '72px').style('text-anchor', 'middle')
      .style('dominant-baseline', 'middle').style('stroke', 'white')
      .text(function (d) {
        return d;
      });
    this.radarSubsciption = interval(1500)
      .pipe(
        take(this.radarPoints.length),
        map(i => this.radarPoints[i])
      ).subscribe(item => {
        this.devices.push(item);
        g.selectAll('circle')
          .data(this.devices)
          .enter()
          .append('circle')
          .attr('cx', function (d) {
            return d.cx;
          })
          .attr('cy', function (d) {
            return d.cy;
          })
          .attr('r', function (d) {
            return 5;
          })
          .style('fill', '#13E213');
      });
  }

  // 渲染滚动元素
  renderSlider() {
    this.sliderItems = [];
    if (this.radarPoints.length > 14) {
      this.sliderSubscription = Observable.interval(1500).pipe(
        map(e => this.radarPoints[e % this.radarPoints.length])
      ).subscribe(item => {
        if (this.sliderItems.length > 14) {
          this.sliderItems.shift();
        }
        this.sliderItems.push(item);
      });
    } else { // 元素过少时不应用滚动效果
      this.sliderItems = this.radarPoints;
    }
  }

  // 查看访客详情对话框
  showVisitorDetailModalDialog(mac: string, item: any): void {
    this.deviceVisitorService.queryTags(mac)
      .subscribe(res => {
        const dialogRef = this.dialog.open(VisitorDetailModalDialogComponent, {
          data: {mac: mac, tags: res, visitor: item},
          scrollStrategy: this.overlay.scrollStrategies.block(),
          width: '800px'
        });
      });

  }

  // 下载列表
  download() {
    swal({
      title: '请确认！',
      text: '确认导出该列表数据?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      buttonsStyling: false
    }).then((result) => {
      if (result.value) {
        const params = {};
        params['starttime'] = this.selectedDate[0];
        params['endtime'] = this.selectedDate[1];
        params['siteId'] = this.webSiteService.getCurrentSelectedSite().value;
        params['selectedProbe'] = '';
        if (this.selectedProbe) {
          params['selectedProbe'] = [this.selectedProbe];
        }
        params['storeId'] = '';
        if (this.selectedStore) {
          params['storeId'] = this.selectedStore;
        }
        const data = JSON.stringify(params);
        $('#exportExcel input').val(data);
        $('#exportExcel').submit();
      }
    })
  }


  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }
}

// 查看访客详情对话框组件
@Component({
  selector: 'app-show-visitor-detail-modal-dialog',
  templateUrl: 'device-visitor-detail-modal-dialog.html',
  styleUrls: ['./device-visitor.component.scss']
})
export class VisitorDetailModalDialogComponent implements OnInit {

  mac: string;
  visitor: any;
  demoSupported = false;
  deviceIsShown = false;
  tags: any;

  gender = 0; // 性别 0:未知 1：男性 2：女性
  age: number; // 年龄
  marriage = '未知'; // 婚姻状况

  population: any[]; // 排除性别 年龄 婚姻后的基础属性集合
  populationText = ''; // 基础属性文字

  brand = '未知'; // 品牌
  model = '未知'; // 型号
  did = ''; // 设备号
  basicText = ''; // 设备信息文字

  apps = []; // 应用偏好
  games = []; // 游戏偏好
  topic = []; // 关注话题
  shopping = []; // 购物偏好
  hotApps = []; // 最常使用app

  lastDate = ''; // 上次访问日期
  visitCount = 0; // 总访问次数
  visitLength = 0; // 平均驻店时长(分)

  constructor(public dialogRef: MatDialogRef<VisitorDetailModalDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private deviceVisitorService: DeviceVisitorService,
              private webSiteService: WebSiteService,
              private notificationService: NotificationService) {
    this.mac = this.data.mac;
    this.tags = this.data.tags;
    this.visitor = this.data.visitor;
  }

  ngOnInit() {
    this.deviceVisitorService.queryDemoSupport(this.webSiteService.getCurrentSelectedSite().value)
      .subscribe(res => {
        this.demoSupported = res.obj;
      });
    this.deviceVisitorService.queryDeviceToDemo(this.webSiteService.getCurrentSelectedSite().value, this.mac)
      .subscribe(res => {
        this.deviceIsShown = res.obj;
      });
    this.did = this.tags['did'];
    if (this.tags['population']) {
      const that = this;
      this.population = _.map(this.tags['population'],
        function (p) {
          const obj = {};
          const s = p['name'].indexOf('-') || 0;
          obj['name'] = p['name'].substr(0, s);
          obj['value'] = p['name'].substr(s + 1);
          if (obj['name'] === '年龄') {
            that.age = obj['value'];
          }
          if (obj['name'] === '婚姻') {
            that.marriage = obj['value'];
          }
          if (obj['name'] === '性别') {
            that.gender = obj['value'] === '男' ? 1 : (obj['value'] === '女' ? 2 : 0);
          }
          return obj;
        }).filter(function (x) {
        return x['name'] !== '年龄' && x['name'] !== '婚姻';
      });
      for (const i in this.population) {
        if (this.population[i].name) {
          this.populationText += this.population[i].name + ':' + this.population[i].value + ' ';
        } else if (this.population[i].value) {
          this.populationText += this.population[i].value + ' ';
        }
      }
    }
    if (this.tags['basic']) {
      const that = this;
      const basicPair = _.map(this.tags['basic'],
        function (p) {
          const mapper = {
            'timeTomarket': '上市时间',
            'hardwareType': '硬件类型',
            'price': '价格',
            'standardBrand': '标准品牌',
            'screen': '屏幕',
            'deviceType': '设备类型',
            'functionType': '功能',
            'originModel': '原始型号',
            'standardModel': '型号',
            'cnBrand': '品牌'
          };
          const obj = {};
          const s = p['name'].indexOf('-') || 0;
          obj['name'] = p['name'].substr(0, s);
          obj['value'] = p['name'].substr(s + 1);
          const standard = {
            name: mapper[obj['name']] || '',
            value: obj['value']
          };
          if (standard.name === '品牌') {
            that.brand = standard.value;
          }
          if (standard.name === '型号') {
            that.model = standard.value;
          }
          return standard;
        }).filter(function (x) {
        return x.name !== '品牌' && x.name !== '型号'
      });
      let tmp = '';
      basicPair.forEach(function (x) {
        if (x.value) {
          tmp += (x.value + ',');
        }
      });
      this.basicText = tmp.length ? tmp.substr(0, tmp.length - 1) : '';
    }
    if (this.tags['app']) {
      this.apps = this.tags['app'];
    }
    if (this.tags['game']) {
      this.games = this.tags['game'];
    }
    if (this.tags['topic']) {
      this.topic = this.tags['topic'];
    }
    if (this.tags['shopping']) {
      this.shopping = this.tags['shopping'];
    }

    if (this.tags['mostused_apps']) {
      const hotapps = this.tags['mostused_apps'];
      this.deviceVisitorService.queryIcons(hotapps.join(','))
        .subscribe(res => {
          this.hotApps = res.rows;
        });
    }

    if (this.tags['probe_log'] && this.tags['probe_log'].length > 0) {
      let visitCount = 0, totalVisitLength = 0;
      let today = '';
      const y = (new Date()).getFullYear();
      const m = ((new Date()).getMonth() + 1);
      let M = '' + m;
      if (m < 10) {
        M = '0' + m;
      }
      const d = (new Date()).getDate();
      today = y + '' + m + '' + d;
      for (const i in this.tags['probe_log']) {
        if (this.tags['probe_log'][i].probe_mac === this.visitor.probemac) {
          this.tags['probe_log'][i].visit = _.sortBy(this.tags['probe_log'][i].visit, 'visit_date');
          const num = this.tags['probe_log'][i].visit.length;
          if (this.tags['probe_log'][i].visit.length > 1) {
            const tmpDate = moment(this.tags['probe_log'][i].visit[num - 2].visit_date + '', 'YYYYMMDD');
            this.lastDate = tmpDate.format('YYYY-MM-DD');
          }
          if (this.tags['probe_log'][i].hasOwnProperty('visit') && this.tags['probe_log'][i].visit.length > 0) {
            for (const j in this.tags['probe_log'][i]['visit']) {
              if (this.tags['probe_log'][i].visit[j].visit_length) {
                totalVisitLength += this.tags['probe_log'][i].visit[j].visit_length;
                visitCount++;
              } else {
                visitCount++;
              }

            }
          }
          if (visitCount > 0) {
            this.visitLength = totalVisitLength / visitCount;
          }
          this.visitCount = this.tags['probe_log'][i].visit_count;
          break;
        }
      }
    }
  }

  // 添加或者删除一键演示
  toggleDemo() {
    if (!this.deviceIsShown) {
      this.deviceVisitorService.addToDemo(this.webSiteService.getCurrentSelectedSite().value, this.mac)
        .subscribe(res => {
          if (res.success) {
            this.notificationService.showNotification(`成功添加设备${this.mac}到一键演示`, '', 1500, 'success');
          } else {
            this.notificationService.showNotification(`添加设备${this.mac}到一键演示失败`, '', 1500, 'danger');
            this.deviceIsShown = !this.deviceIsShown;
          }
        }, error => this.deviceIsShown = !this.deviceIsShown);
    } else {
      this.deviceVisitorService.deleteToDemo(this.webSiteService.getCurrentSelectedSite().value, this.mac)
        .subscribe(res => {
          if (res.success) {
            this.notificationService.showNotification(`成功从一键演示删除设备${this.mac}`, '', 1500, 'success');
          } else {
            this.notificationService.showNotification(`从一键演示删除设备${this.mac}失败`, '', 1500, 'danger');
            this.deviceIsShown = !this.deviceIsShown;
          }
        }, error => this.deviceIsShown = !this.deviceIsShown);
    }
  }

  save(): void {
    this.dialogRef.close(true);
  }
}
