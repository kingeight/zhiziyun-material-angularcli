import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs/Rx';
import * as moment from 'moment';
import {WebSiteService} from '../../../web-site.service';
import {NotificationService} from '../../../util/notification/notification.service';
import {DeviceVisitorReportService} from '../../device-visitor-report.service';

@Component({
  selector: 'app-device-visitor-basic-attribute',
  templateUrl: './device-visitor-basic-attribute.component.html',
  styleUrls: ['./device-visitor-basic-attribute.component.scss']
})
export class DeviceVisitorBasicAttributeComponent implements OnInit, OnDestroy {

  subscription: Subscription;

  @Input() stores; // 门店集合
  selectedStore = undefined; // 被选中的门店

  @Input() probes; // 探针集合
  selectedProbe = undefined; // 被选中的探针

  selectedDate: string[]; // 日期范围

  pieToolTips = {
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
  };

  agePieChartOptions: any = { // 年龄报表配置对象
    responsive: true,
    maintainAspectRatio: false,
    title: {
      display: true,
      text: '年龄分布'
    },
    tooltips: this.pieToolTips
  };
  agePieChartLabels: string[] = []; // 年龄饼图数据
  agePieChartData: number[] = [];

  genderPieChartOptions: any = { // 性别报表配置对象
    responsive: true,
    maintainAspectRatio: false,
    title: {
      display: true,
      text: '性别分布'
    },
    tooltips: this.pieToolTips
  };
  genderPieChartLabels: string[] = []; // 性别饼图数据
  genderPieChartData: number[] = [];

  marriagePieChartOptions: any = { // 婚恋状态报表配置对象
    responsive: true,
    maintainAspectRatio: false,
    title: {
      display: true,
      text: '婚姻状态分布'
    },
    tooltips: this.pieToolTips
  };
  marriagePieChartLabels: string[] = []; // 婚恋状态饼图数据
  marriagePieChartData: number[] = [];

  constructor(private webSiteService: WebSiteService,
              private deviceVisitorReportService: DeviceVisitorReportService,
              private notificationService: NotificationService) {
    this.subscription = this.webSiteService.getMessage().subscribe(site => { // 所选网站变化事件，所有跟site相关的数据都应该在这里执行
      // 初始化数据
      this.initData();
    });
    this.selectedDate = [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')];
  }

  ngOnInit() {
    this.initData();
  }

  initData() {
    this.selectedStore = undefined;
    this.selectedProbe = undefined;
    this.getReportData();
  }

  search() {
    this.getReportData();
  }

  getReportData() {
    this.agePieChartLabels = [];
    this.agePieChartData = [];
    this.genderPieChartLabels = [];
    this.genderPieChartData = [];
    this.marriagePieChartLabels = [];
    this.marriagePieChartData = [];
    this.deviceVisitorReportService.deVisitAgeAndGender(this.selectedDate[0], this.selectedDate[1],
      this.selectedProbe !== undefined ? this.selectedProbe : 0,
      this.selectedStore !== undefined ? this.selectedStore : 0,
      this.webSiteService.getCurrentSelectedSite().value)
      .subscribe(res => {
        if (res.reportMap['age']['series'][0]['data'].length === 0) {
          this.notificationService.showNotification(`查无数据`, '', 1500, 'danger');
        }
        if (res.reportMap['age'] && res.reportMap['age']['series'].length > 0) {
          for (let i = 0; i < res.reportMap['age']['series'][0]['data'].length; i++) {
            this.agePieChartLabels.push(res.reportMap['age']['series'][0]['data'][i]['name']);
            this.agePieChartData.push(res.reportMap['age']['series'][0]['data'][i]['value']);
          }
        }
        if (res.reportMap['gender'] && res.reportMap['gender']['series'].length > 0) {
          for (let i = 0; i < res.reportMap['gender']['series'][0]['data'].length; i++) {
            this.genderPieChartLabels.push(res.reportMap['gender']['series'][0]['data'][i]['name']);
            this.genderPieChartData.push(res.reportMap['gender']['series'][0]['data'][i]['value']);
          }
        }
        if (res.reportMap['marriage'] && res.reportMap['marriage']['series'].length > 0) {
          for (let i = 0; i < res.reportMap['marriage']['series'][0]['data'].length; i++) {
            this.marriagePieChartLabels.push(res.reportMap['marriage']['series'][0]['data'][i]['name']);
            this.marriagePieChartData.push(res.reportMap['marriage']['series'][0]['data'][i]['value']);
          }
        }
      });
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

}
