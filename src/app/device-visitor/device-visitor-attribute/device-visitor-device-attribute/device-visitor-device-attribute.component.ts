import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Rx';
import {WebSiteService} from '../../../web-site.service';
import {NotificationService} from '../../../util/notification/notification.service';
import {DeviceVisitorReportService} from '../../device-visitor-report.service';
import * as moment from 'moment';

@Component({
  selector: 'app-device-visitor-device-attribute',
  templateUrl: './device-visitor-device-attribute.component.html',
  styleUrls: ['./device-visitor-device-attribute.component.scss']
})
export class DeviceVisitorDeviceAttributeComponent implements OnInit, OnDestroy {

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

  brandPieChartOptions: any = { // 手机品牌报表配置对象
    responsive: true,
    maintainAspectRatio: false,
    title: {
      display: true,
      text: '品牌分布'
    },
    tooltips: this.pieToolTips
  };
  brandPieChartLabels: string[] = []; // 手机品牌饼图数据
  brandPieChartData: number[] = [];

  modelPieChartOptions: any = { // 手机型号报表配置对象
    responsive: true,
    maintainAspectRatio: false,
    title: {
      display: true,
      text: '型号分布'
    },
    tooltips: this.pieToolTips
  };
  modelPieChartLabels: string[] = []; // 手机型号饼图数据
  modelPieChartData: number[] = [];

  pricePieChartOptions: any = { // 手机价格报表配置对象
    responsive: true,
    maintainAspectRatio: false,
    title: {
      display: true,
      text: '价格分布'
    },
    tooltips: this.pieToolTips
  };
  pricePieChartLabels: string[] = []; // 手机价格饼图数据
  pricePieChartData: number[] = [];

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
    this.brandPieChartLabels = [];
    this.brandPieChartData = [];
    this.modelPieChartLabels = [];
    this.modelPieChartData = [];
    this.pricePieChartLabels = [];
    this.pricePieChartData = [];
    this.deviceVisitorReportService.deVisitBrandDevicePrice(this.selectedDate[0], this.selectedDate[1],
      this.selectedProbe !== undefined ? this.selectedProbe : 0,
      this.selectedStore !== undefined ? this.selectedStore : 0,
      this.webSiteService.getCurrentSelectedSite().value)
      .subscribe(res => {
        if (res.reportMap['brand']['series'][0]['data'].length === 0) {
          this.notificationService.showNotification(`查无数据`, '', 1500, 'danger');
        }
        if (res.reportMap['brand'] && res.reportMap['brand']['series'].length > 0) {
          for (let i = 0; i < res.reportMap['brand']['series'][0]['data'].length; i++) {
            this.brandPieChartLabels.push(res.reportMap['brand']['series'][0]['data'][i]['name']);
            this.brandPieChartData.push(res.reportMap['brand']['series'][0]['data'][i]['value']);
          }
        }
        if (res.reportMap['model'] && res.reportMap['model']['series'].length > 0) {
          for (let i = 0; i < res.reportMap['model']['series'][0]['data'].length; i++) {
            this.modelPieChartLabels.push(res.reportMap['model']['series'][0]['data'][i]['name']);
            this.modelPieChartData.push(res.reportMap['model']['series'][0]['data'][i]['value']);
          }
        }
        if (res.reportMap['price'] && res.reportMap['price']['series'].length > 0) {
          for (let i = 0; i < res.reportMap['price']['series'][0]['data'].length; i++) {
            this.pricePieChartLabels.push(res.reportMap['price']['series'][0]['data'][i]['name']);
            this.pricePieChartData.push(res.reportMap['price']['series'][0]['data'][i]['value']);
          }
        }
      });
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

}
