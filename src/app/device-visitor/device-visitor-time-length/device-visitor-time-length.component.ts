import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Rx';
import {WebSiteService} from '../../web-site.service';
import {StoreService} from '../../probe/store/store.service';
import {ProbeService} from '../../probe/probe/probe.service';
import {forkJoin} from 'rxjs/index';
import * as moment from 'moment';
import {NotificationService} from '../../util/notification/notification.service';
import {DeviceVisitorReportService} from '../device-visitor-report.service';
import {PageEvent} from '@angular/material';
import swal from "sweetalert2";
import * as $ from "jquery";

@Component({
  selector: 'app-device-visitor-time-length',
  templateUrl: './device-visitor-time-length.component.html',
  styleUrls: ['./device-visitor-time-length.component.scss']
})
export class DeviceVisitorTimeLengthComponent implements OnInit, OnDestroy {

  subscription: Subscription;

  stores: any[]; // 门店集合
  selectedStore = undefined; // 被选中门店

  probes: any[]; // 探针集合
  selectedProbe = undefined; // 被选中的探针

  selectedDate: string[]; // 日期范围

  list: any[]; // 列表显示项集合
  page = 0;
  rows = 10;
  total = 0;
  displayedColumns: any[] = ['timeLength', 'uv'];

  pieChartOptions: any = { // 报表配置对象
    responsive: true,
    maintainAspectRatio: false,
    title: {
      display: true,
      text: '停留时长分布'
    },
    tooltips: {
      callbacks: {
        label: function (tooltipItem, data) {
          const dataset = data.datasets[tooltipItem.datasetIndex];
          const meta = dataset._meta[Object.keys(dataset._meta)[0]];
          const total = meta.total;
          const currentValue = dataset.data[tooltipItem.index];
          const percentage = parseFloat((currentValue / total * 100).toFixed(1));
          return currentValue + ' (' + percentage + '%)';
        },
        title: function (tooltipItem, data) {
          return data.labels[tooltipItem[0].index];
        }
      }
    }
  };
  pieChartLabels: string[] = []; // 饼图数据
  pieChartData: number[] = [];

  constructor(private storeService: StoreService,
              private probeService: ProbeService,
              private webSiteService: WebSiteService,
              private deviceVisitorReportService: DeviceVisitorReportService,
              private notificationService: NotificationService) {
    this.subscription = this.webSiteService.getMessage().subscribe(site => { // 所选网站变化事件，所有跟site相关的数据都应该在这里执行
      // 初始化数据
      this.initData();
    });
    this.selectedDate = [moment().add(-7, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')];
  }

  ngOnInit() {
    this.initData();
  }

  initData() {
    this.selectedStore = undefined;
    this.selectedProbe = undefined;
    this.stores = [{name: '全部', id: undefined}];
    this.probes = [{name: '全部', id: undefined}];
    const post0 = this.storeService.listAll(this.webSiteService.getCurrentSelectedSite().value);
    const post1 = this.probeService.listAll(this.webSiteService.getCurrentSelectedSite().value);
    forkJoin([post0, post1])
      .subscribe(res => {
        this.stores = this.stores.concat(res[0].rows);
        this.probes = this.probes.concat(res[1].rows);
      });
    this.getReportData();
    this.getList();
  }

  getReportData() {
    this.pieChartLabels = [];
    this.pieChartData = [];
    this.deviceVisitorReportService.deVisitTimeLength(this.selectedDate[0], this.selectedDate[1],
      this.selectedProbe !== undefined ? this.selectedProbe : 0,
      this.selectedStore !== undefined ? this.selectedStore : 0,
      this.webSiteService.getCurrentSelectedSite().value)
      .subscribe(res => {
        if (res.reportMap.series[0].data.length === 0) {
          this.notificationService.showNotification(`查无数据`, '', 1500, 'danger');
        }
        if (res.reportMap.series && res.reportMap.series.length > 0) {
          for (let i = 0; i < res.reportMap.series[0]['data'].length; i++) {
            if (res.reportMap.series[0]['data'][i]['name'] === 'UNKNOWN') {
              continue;
            }
            this.pieChartLabels.push(res.reportMap.series[0]['data'][i]['name']);
            this.pieChartData.push(res.reportMap.series[0]['data'][i]['value']);
          }
        }
      });
  }

  getList(e: PageEvent = null) {
    if (e != null) {
      this.page = e.pageIndex;
      this.rows = e.pageSize;
    }
    this.deviceVisitorReportService.deVisitTimeLengthList(this.selectedDate[0], this.selectedDate[1],
      this.selectedProbe !== undefined ? this.selectedProbe : 0,
      this.selectedStore !== undefined ? this.selectedStore : 0,
      this.webSiteService.getCurrentSelectedSite().value, this.page + 1, this.rows)
      .subscribe(res => {
        this.list = res.rows;
        this.total = res.total;
      });
  }

  search() {
    this.page = 0;
    this.getList();
    this.getReportData();
  }

  export() {
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
        params['filedName'] = ['timeLength', 'uv'];
        params['excelHead'] = '停留时长,人数';
        params['filename'] = '报表';
        params['sqlMethod'] = 'deVisitTimeLengthList';
        params['beginTime'] = this.selectedDate[0];
        params['endTime'] = this.selectedDate[1];
        params['siteId'] = this.webSiteService.getCurrentSelectedSite().value;
        params['microprobeId'] = (this.selectedProbe !== undefined ? this.selectedProbe : 0);
        params['storeId'] = (this.selectedStore !== undefined ? this.selectedStore : 0);
        const data = JSON.stringify(params);
        $('#universalExcel input').val(data);
        $('#universalExcel').submit();
      }
    })
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }
}
