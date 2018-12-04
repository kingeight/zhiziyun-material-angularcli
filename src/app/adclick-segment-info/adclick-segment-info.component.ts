import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Rx';
import {WebSiteService} from '../web-site.service';
import {NotificationService} from '../util/notification/notification.service';
import {AdclickSegmentInfoService} from './adclick-segment-info.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, PageEvent} from '@angular/material';
import swal from 'sweetalert2';
import {Overlay} from '@angular/cdk/overlay';
import * as moment from 'moment';

@Component({
  selector: 'app-adclick-segment-info',
  templateUrl: './adclick-segment-info.component.html',
  styleUrls: ['./adclick-segment-info.component.scss']
})
export class AdclickSegmentInfoComponent implements OnInit, OnDestroy {

  subscription: Subscription;

  archiveStatuses: any[]; // 归档状态
  selectedArchiveStatus = 0; // 选中的归档状态

  searchText = ''; // 搜索文字

  list: any[]; // 列表数据
  page = 0;
  rows = 10;
  total = 0;

  displayedColumns = ['name', 'beginTime', 'endTime', 'count', 'createTime', 'actions'];


  constructor(private webSiteService: WebSiteService,
              private notificationService: NotificationService,
              private adclickSegmentInfoService: AdclickSegmentInfoService,
              public dialog: MatDialog, private overlay: Overlay) {
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
    this.adclickSegmentInfoService.list(this.webSiteService.getCurrentSelectedSite().value,
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
    if (!segment.status) {
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
          this.adclickSegmentInfoService.updateArchive(segment['id']).subscribe(res => {
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

  // 查看人群弹窗
  openViewSegmentDialog(index: number): void {
    this.adclickSegmentInfoService.getPlans(this.list[index]['plan'])
      .subscribe(res => {
        const dialogRef = this.dialog.open(ViewAdclickSegmentInfoModalDialogComponent, {
          data: {segment: this.list[index], plans: res},
          scrollStrategy: this.overlay.scrollStrategies.noop()
        });
        dialogRef.afterClosed().subscribe(result => {
          // TODO
        });
      });

  }

  // 新建人群弹窗
  openAddSegmentDialog(): void {
    const dialogRef = this.dialog.open(AddAdclickSegmentInfoModalDialogComponent, {
      data: this.adclickSegmentInfoService.activityList(this.webSiteService.getCurrentSelectedSite().value, 1, ''),
      scrollStrategy: this.overlay.scrollStrategies.noop(),
      width: '600px'
    });
    dialogRef.afterClosed().subscribe(result => {
      this.search();
    });
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }
}

// 查看人群对话框
@Component({
  selector: 'app-view-adclick-segment-info-modal-dialog',
  templateUrl: 'view-adclick-segment-info-modal-dialog.html',
})
export class ViewAdclickSegmentInfoModalDialogComponent implements OnInit {

  segment: any;

  plans: any[]

  constructor(public dialogRef: MatDialogRef<ViewAdclickSegmentInfoModalDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.segment = this.data.segment;
    this.plans = this.data.plans;
  }

  ok() {
    this.dialogRef.close(true);
  }
}

// 新建人群对话框
@Component({
  selector: 'app-add-adclick-segment-info-modal-dialog',
  templateUrl: 'add-adclick-segment-info-modal-dialog.html',
})
export class AddAdclickSegmentInfoModalDialogComponent implements OnInit {

  selectedDate: any[];

  activites: any[];

  minDate: string;

  searchText = ''; // 活动搜索关键词

  page = 1; // 活动翻页数

  selectedPlan: any[];

  name = ''; // 人群名称

  constructor(public dialogRef: MatDialogRef<AddAdclickSegmentInfoModalDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private adclickSegmentInfoService: AdclickSegmentInfoService,
              private webSiteService: WebSiteService,
              private notificationService: NotificationService) {
    this.selectedDate = [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')];
    this.minDate = moment().subtract(90, 'days').format('YYYY-MM-DD');
    this.selectedPlan = [];
    data.subscribe(res => {
      this.activites = res;
    });
  }

  ngOnInit() {
  }

  searchActivity() {
    this.page = 1;
    this.adclickSegmentInfoService.activityList(this.webSiteService.getCurrentSelectedSite().value, 1, this.searchText)
      .subscribe(res => {
        this.activites = res;
      })
  }

  showMore() {
    this.page++;
    this.adclickSegmentInfoService.activityList(this.webSiteService.getCurrentSelectedSite().value, this.page, this.searchText)
      .subscribe(res => {
        this.activites = this.activites.concat(res);
        if (res && res.length < 10) {
          this.notificationService.showNotification('没有更多了', '', 1500, 'warning');
        }
      })
  }

  onTagCheckChange(event) {
    if (event.checked) {
      this.selectedPlan.push(event.source.value);
    } else {
      const i = this.selectedPlan.indexOf(event.source.value);
      if (i > -1) {
        this.selectedPlan.splice(i, 1);
      }
    }
  }

  removePlan(plan) {
    const i = this.selectedPlan.indexOf(plan);
    if (i > -1) {
      this.selectedPlan.splice(i, 1);
    }
  }

  tagChecked(plan) {
    if ($.inArray(plan, this.selectedPlan) === -1) {
      return false;
    } else {
      return true;
    }
  }

  expandActivity(activity) {
    if (!activity.hasOwnProperty('plans')) {
      this.adclickSegmentInfoService.planList(activity['entityId'])
        .subscribe(res => {
          activity['plans'] = res;
        });
    }
  }

  save() {
    if (this.selectedPlan.length === 0) {
      return this.notificationService.showNotification('请至少选择一个计划', '', 1500, 'danger');
    }
    const ary = [];
    for (let i = 0; i < this.selectedPlan.length; i++) {
      ary.push(this.selectedPlan[i]['entityId']);
    }
    this.adclickSegmentInfoService.add(this.webSiteService.getCurrentSelectedSite().value, this.name, ary.join(','), this.selectedDate[0], this.selectedDate[1])
      .subscribe(res => {
        if (res.success) {
          this.notificationService.showNotification(res.msg, '', 1500, 'success');
          this.dialogRef.close(true);
        } else {
          this.notificationService.showNotification(res.msg, '', 1500, 'danger');
        }
      })

  }
}
