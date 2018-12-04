import {Component, OnDestroy, OnInit, Input} from '@angular/core';
import {Subscription} from 'rxjs/Rx';
import {WebSiteService} from '../../../web-site.service';
import {NotificationService} from '../../../util/notification/notification.service';
import {StoreService} from '../../../probe/store/store.service';
import {ProbeService} from '../../../probe/probe/probe.service';
import {DeviceVisitorReportService} from '../../device-visitor-report.service';
import * as moment from 'moment';
import {PageEvent} from '@angular/material';
import swal from 'sweetalert2';
import * as $ from 'jquery';

@Component({
  selector: 'app-device-visitor-type-report-by-type',
  templateUrl: './device-visitor-type-report-by-type.component.html',
  styleUrls: ['./device-visitor-type-report-by-type.component.scss']
})
export class DeviceVisitorTypeReportByTypeComponent implements OnInit, OnDestroy {

  subscription: Subscription;

  @Input() stores; // 门店集合
  selectedStore; // 被选中门店

  @Input() probes; // 探针集合
  selectedProbe; // 被选中的探针

  visitorTypes: any[]; // 访客类型集合
  selectedVisitType = '';

  selectedDate: string[]; // 日期范围

  list: any[]; // 列表显示项集合
  page = 0;
  rows = 10;
  total = 0;
  displayedColumns: any[] = ['statDate', 'visitorType', 'uv'];

  pieChartOptions: any = { // 报表配置对象
    responsive: true,
    maintainAspectRatio: false,
    title: {
      display: true,
      text: '新老访客分布'
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

  lineChartOptions: any = { // 报表配置对象
    responsive: true,
    maintainAspectRatio: false,
    title: {
      display: true,
      text: '新老访客趋势分布'
    }
  };
  lineChartData: any[] = []; // 折线图
  lineChartLabels: string[] = [];

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
    this.visitorTypes = [{value: undefined, text: '全部'}, {value: '0', text: '老客户'}, {value: '1', text: '新客户'}];
  }

  ngOnInit() {
    this.initData();
  }

  initData() {
    this.selectedStore = undefined;
    this.selectedProbe = undefined;
    this.selectedVisitType = undefined;
    this.getReportData();
    this.getList();
  }

  search() {
    this.page = 0;
    this.getList();
    this.getReportData();
  }

  getReportData() {
    this.pieChartLabels = [];
    this.pieChartData = [];
    this.lineChartData = [];
    this.lineChartLabels = [];
    this.deviceVisitorReportService.deVisitType(this.selectedDate[0], this.selectedDate[1],
      this.selectedProbe !== undefined ? this.selectedProbe : 0,
      this.selectedStore !== undefined ? this.selectedStore : 0,
      this.webSiteService.getCurrentSelectedSite().value, this.selectedVisitType !== undefined ? this.selectedVisitType : '')
      .subscribe(res => {
        if (res.reportMap.series[0].data.length === 0) {
          this.notificationService.showNotification(`查无数据`, '', 1500, 'danger');
        }
        if (res.reportMap.series && res.reportMap.series.length > 0) {
          for (let i = 0; i < res.reportMap.series[0]['data'].length; i++) {
            this.pieChartLabels.push(res.reportMap.series[0]['data'][i]['name']);
            this.pieChartData.push(res.reportMap.series[0]['data'][i]['value']);
          }
        }
        if (res.reportMap1.series && res.reportMap1.series.length > 0) {
          this.lineChartLabels = res.reportMap1.categories;
          for (let i = 0; i < res.reportMap1.series.length; i++) {
            const tmpData = {};
            tmpData['data'] = res.reportMap1.series[i]['data'];
            tmpData['label'] = res.reportMap1.series[i]['name'];
            tmpData['lineTension'] = 0;
            tmpData['fill'] = false;
            this.lineChartData.push(tmpData);
          }
        }
      });
  }

  getList(e: PageEvent = null) {
    if (e != null) {
      this.page = e.pageIndex;
      this.rows = e.pageSize;
    }
    this.deviceVisitorReportService.deVisitTypeList(this.selectedDate[0], this.selectedDate[1],
      this.selectedProbe !== undefined ? this.selectedProbe : 0, this.selectedStore !== undefined ? this.selectedStore : 0,
      this.webSiteService.getCurrentSelectedSite().value, this.page + 1, this.rows,
      this.selectedVisitType !== undefined ? this.selectedVisitType : '')
      .subscribe(res => {
        this.list = res.rows;
        this.total = res.total;
      });
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
        params['filedName'] = ['statDate', 'visitorTypeName', 'uv'];
        params['excelHead'] = '日期,访客,独立访问数';
        params['filename'] = '报表';
        params['sqlMethod'] = 'deVisitTypeList';
        params['beginTime'] = this.selectedDate[0];
        params['endTime'] = this.selectedDate[1];
        params['siteId'] = this.webSiteService.getCurrentSelectedSite().value;
        params['microprobeId'] = (this.selectedProbe !== undefined ? this.selectedProbe : 0);
        params['storeId'] = (this.selectedStore !== undefined ? this.selectedStore : 0);
        params['visitorType'] = (this.selectedVisitType !== undefined ? this.selectedVisitType : '');
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
