import {Component, OnDestroy, OnInit, Input} from '@angular/core';
import {WebSiteService} from '../../../web-site.service';
import {StoreService} from '../../../probe/store/store.service';
import {ProbeService} from '../../../probe/probe/probe.service';
import {Subscription} from 'rxjs/Rx';
import {DeviceVisitorReportService} from '../../device-visitor-report.service';
import * as moment from 'moment';
import {NotificationService} from '../../../util/notification/notification.service';
import swal from 'sweetalert2';
import * as $ from 'jquery';

@Component({
  selector: 'app-device-visitor-all-report-by-hour',
  templateUrl: './device-visitor-all-report-by-hour.component.html',
  styleUrls: ['./device-visitor-all-report-by-hour.component.scss']
})
export class DeviceVisitorAllReportByHourComponent implements OnInit, OnDestroy {

  subscription: Subscription;

  @Input() stores; // 门店集合
  selectedStore = undefined; // 被选中门店

  @Input() probes; // 探针集合
  selectedProbe = undefined; // 被选中的探针

  selectedDate: string[]; // 日期范围

  barChartOptions: any = { // 报表配置对象
    responsive: true,
    maintainAspectRatio: false,
    title: {
      display: true,
      text: '到店客流时段分析'
    }
  };
  barChartLabels: string[] = [];
  barChartData: any[] = [];

  list: any[]; // 列表显示项集合

  displayedColumns = ['hour', 'totalUV', 'uv', 'rate'];

  constructor(private storeService: StoreService,
              private probeService: ProbeService,
              private webSiteService: WebSiteService,
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
    this.barChartLabels = [];
    this.barChartData = [];
    this.list = [];
    this.getReportData();
  }

  search() {
    this.getReportData();
  }

  getReportData() {
    this.barChartLabels = [];
    this.barChartData = [];
    this.deviceVisitorReportService.deVisitHour(this.selectedDate[0], this.selectedDate[1],
      this.selectedProbe !== undefined ? this.selectedProbe : 0,
      this.selectedStore !== undefined ? this.selectedStore : 0,
      this.webSiteService.getCurrentSelectedSite().value)
      .subscribe(res => {
        if (res.reportMap.series[0].data.length === 0) {
          this.notificationService.showNotification(`查无数据`, '', 1500, 'danger');
        }
        if (res.reportMap.categories && res.reportMap.categories.length > 0) {
          this.list = res.reportList;
          this.barChartLabels = res.reportMap['categories'];
          this.barChartData = res.reportMap['series'];
          this.barChartData[0].label = '';
        }
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
        params['filedName'] = ['statDate', 'hour', 'totalUV', 'uv'];
        params['excelHead'] = '日期,小时,环境客流,进店客流';
        params['filename'] = '报表';
        params['sqlMethod'] = 'deVisitHourList';
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
