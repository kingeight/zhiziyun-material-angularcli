import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Rx';
import {WebSiteService} from '../web-site.service';
import {DeviceSegmentInfoService} from './device-segment-info.service';
import {NotificationService} from '../util/notification/notification.service';
import swal from 'sweetalert2';
import {PageEvent} from '@angular/material';
import {Router} from '@angular/router';

@Component({
  selector: 'app-device-segment-info',
  templateUrl: './device-segment-info.component.html',
  styleUrls: ['./device-segment-info.component.scss']
})
export class DeviceSegmentInfoComponent implements OnInit, OnDestroy {

  subscription: Subscription;

  archiveStatuses: any[]; // 归档状态
  selectedArchiveStatus = 0; // 选中的归档状态

  searchText = ''; // 搜索文字

  list: any[]; // 列表数据
  page = 0;
  rows = 10;
  total = 0;

  displayedColumns = ['name', 'beginTime', 'endTime', 'status', 'count', 'createTime', 'actions'];

  constructor(private webSiteService: WebSiteService,
              private deviceSegmentInfoService: DeviceSegmentInfoService,
              private notificationService: NotificationService,
              private router: Router) {
    this.subscription = this.webSiteService.getMessage().subscribe(site => { // 所选网站变化事件，所有跟site相关的数据都应该在这里执行
      // 初始化数据
      this.initData();
    });
    this.archiveStatuses = [{value: 0, text: '未归档'}, {value: 1, text: '已归档'}];
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
    this.deviceSegmentInfoService.list(this.webSiteService.getCurrentSelectedSite().value,
      this.selectedArchiveStatus, this.searchText, this.page + 1, this.rows)
      .subscribe(res => {
        this.list = res.rows;
        this.total = res.total;
      });
  }

  toggleColum(colum: string) { // 显示或隐藏列
    let columIsShowing = false;
    let index = -1;
    for (let i = 0; i < this.displayedColumns.length; i++) {
      if (this.displayedColumns[i] === colum) {
        columIsShowing = true;
        index = i;
      }
    }
    if (columIsShowing) {
      this.displayedColumns.splice(index, 1);
    } else {
      this.displayedColumns.unshift(colum);
    }
  }

  toggleArchive(segment: any) { // 切换人群归档状态
    if (segment.status) {
      this.notificationService.showNotification('只有已结束的人群才能归档或回档', '错误', 1500, 'danger');
    } else {
      const msg = segment.archived ? '确认回档该人群吗？' : '确认归档该人群吗？';
      swal({
        title: '确认?',
        text: msg,
        type: 'warning',
        showCancelButton: true,
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-danger',
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        buttonsStyling: false
      }).then((result) => {
        if (result.value) {
          this.deviceSegmentInfoService.updateArchive(segment['id']).subscribe(res => {
            if (res.success) {
              this.getList();
              this.notificationService.showNotification(res.msg, '', 1500, 'success');
            } else {
              this.notificationService.showNotification(res.msg, '错误', 1500, 'danger');
            }
          })
        }
      })
    }
  }

  forceEnd(segment: any) { // 强制结束人群
    if (!segment.status) {
      this.notificationService.showNotification('只有未结束的人群才可以强制结束', '错误', 1500, 'danger');
    } else {
      swal({
        title: '确认?',
        text: '人群计算有一定时间的延迟，手动结束后人群数量可能发生变化，且十分钟内收集到的人群可能会丢失,确认强制结束吗?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-danger',
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        buttonsStyling: false
      }).then((result) => {
        if (result.value) {
          this.deviceSegmentInfoService.forceEnd(segment['id']).subscribe(res => {
            if (res.success) {
              this.getList();
              this.notificationService.showNotification(res.msg, '', 1500, 'success');
            } else {
              this.notificationService.showNotification(res.msg, '错误', 1500, 'danger');
            }
          })
        }
      })
    }
  }

  export(id: number) { // 导出人群
    swal({
      title: '确认?',
      text: '确认导出该人群数据?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      buttonsStyling: false
    }).then((result) => {
      if (result.value) {
        const formData = {};
        formData['id'] = id;
        formData['siteId'] = this.webSiteService.getCurrentSelectedSite().value;
        const data = JSON.stringify(formData);
        $('#exportExcel input').val(data);
        $('#exportExcel').submit();
      }
    })
  }

  createDeviceSegment() {
    this.router.navigate(['/newdevicesegmentinfo']);
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

}
