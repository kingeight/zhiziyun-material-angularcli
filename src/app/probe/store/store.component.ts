import {Component, OnInit, OnDestroy} from '@angular/core';
import {WebSiteService} from '../../web-site.service';
import {StoreService} from './store.service';
import {Subscription} from 'rxjs/Rx';
import {PageEvent} from '@angular/material';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Inject} from '@angular/core';
import {Coordinate} from '../../util/coordinate';
import {Overlay} from '@angular/cdk/overlay';
import swal from 'sweetalert2';
import {NotificationService} from '../../util/notification/notification.service';
import {BaiduMapLoader} from '../../util/baidu-map-loader';

declare const $: any;

const provinces = ['北京市', '天津市', '上海市', '重庆市', '黑龙江省', '吉林省', '辽宁省', '河北省', '山东省', '江苏省', '浙江省', '福建省',
  '广东省', '海南省', '云南省', '四川省', '青海省', '甘肃省', '贵州省', '湖南省', '湖北省', '江西省', '安徽省', '河南省', '山西省', '陕西省',
  '新疆维吾尔自治区', '西藏自治区', '宁夏回族自治区', '广西壮族自治区', '内蒙古自治区'];

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  storeList: any[]; // 查询到的门店数据
  page: number; // 翻页数
  rows: number; // 翻页量
  total: number; // 数据总量
  searchText: string; // 搜索关键词
  displayedColumns: any[] = ['name', 'probeCount', 'createTime', 'actions'];

  constructor(private webSiteService: WebSiteService, private storeService: StoreService,
              public dialog: MatDialog, private overlay: Overlay, private notificationService: NotificationService) {
    this.page = 0;
    this.rows = 10;
    this.storeList = [];
    this.searchText = '';
    this.total = 0;
    this.subscription = this.webSiteService.getMessage().subscribe(site => { // 所选网站变化事件，所有跟site相关的数据都应该在这里执行
      console.log(site);
      this.initData();
    });
  }

  ngOnInit() {
    this.initData();
  }

  // 初始化数据
  initData() {
    this.getStoreList();
  }

  // 获取门店列表
  getStoreList(e: PageEvent = null) {
    if (e != null) {
      this.page = e.pageIndex;
      this.rows = e.pageSize;
    }
    this.storeService.list(this.webSiteService.getCurrentSelectedSite().value, this.searchText, this.page + 1, this.rows)
      .subscribe(data => {
        this.total = data.total
        this.storeList = data.rows;
      });
  }

  // 搜索门店
  searchStore() {
    this.page = 0;
    this.getStoreList();
  }

  // 删除门店
  delStore(store: any) {
    if (store.probeCount > 0) {
      return this.notificationService.showNotification(
        '该门店下还有' + store.probeCount + '个已绑定的探针，请先解绑这些探针再删除对应门店!', '错误', 1500, 'warning');
    }
    swal({
      title: '确认?',
      text: '确认删除该门店吗!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      buttonsStyling: false
    }).then((result) => {
      if (result.value) {
        this.storeService.remove(store['id']).subscribe(data => {
          if (data.success) {
            swal(
              {
                title: '已删除!',
                text: '该门店已经被删除.',
                type: 'success',
                confirmButtonClass: 'btn btn-success',
                buttonsStyling: false
              }
            )
            this.getStoreList();
          } else {
            this.notificationService.showNotification(data.msg, '错误', 1500, 'danger');
          }
        })

      }
    })
  }

  // 新增门店弹窗
  openAddStoreDialog(): void {
    const dialogRef = this.dialog.open(AddStoreModalDialogComponent, {
      data: {site: this.webSiteService.getCurrentSelectedSite()},
      scrollStrategy: this.overlay.scrollStrategies.noop()
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.page = 0;
        this.getStoreList();
      }
    });
  }

  // 编辑门店弹窗
  openEditStoreDialog(index: number): void {
    const dialogRef = this.dialog.open(EditStoreModalDialogComponent, {
      data: this.storeList[index],
      scrollStrategy: this.overlay.scrollStrategies.noop()
    });

    dialogRef.afterClosed().subscribe(result => {
      // TODO
    });
  }


  // 一定要在组件注销时取消订阅
  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }
}

// 新增门店对话框组件
@Component({
  selector: 'app-add-store-modal-dialog',
  templateUrl: 'add-store-modal-dialog.html',
})
export class AddStoreModalDialogComponent implements OnInit {

  point: Coordinate = {lat: 0, lng: 0};
  searchText = '';
  searchText2 = '上海';
  BMap: any;
  store: any;
  limitLocations: any;

  constructor(public dialogRef: MatDialogRef<AddStoreModalDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private notificationService: NotificationService,
              private storeService: StoreService) {
    BaiduMapLoader.load()
      .then(res => {
        this.BMap = res;
      })
  }

  save(): void {
    if (this.point.lat === 0 || this.point.lng === 0) {
      swal({
        title: '请在地图上点选门店地理位置',
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-danger'
      }).catch(swal.noop)
    } else {
      const myGeo = new this.BMap.Geocoder();
      let address: string;
      // 根据坐标得到地址描述
      myGeo.getLocation(new this.BMap.Point(this.point.lng, this.point.lat), result => {
        if (result) {
          address = result.addressComponents.province;
        }
        if ($.inArray(address, provinces) === -1) {
          swal({
            title: '仅限中国大陆地区',
            type: 'error',
            buttonsStyling: false,
            confirmButtonClass: 'btn btn-danger'
          }).catch(swal.noop)
          address = undefined;
          return;
        }
        if (!this.storeService.inLocation(result.addressComponents, this.limitLocations)) {
          swal({
            title: '由于区域保护，您不能在此地区新建门店,请咨询管理员获得可使用地区信息！',
            type: 'error',
            buttonsStyling: false,
            confirmButtonClass: 'btn btn-danger'
          }).catch(swal.noop)
          address = undefined;
          return;
        }
        this.store.area = Math.PI * this.store.radius * this.store.radius;
        this.store.longitude = this.point.lng;
        this.store.latitude = this.point.lat;
        this.storeService.insert(this.store)
          .subscribe(data => {
            if (data.success) {
              // 保存门店
              this.notificationService.showNotification('保存成功', '', 1500, 'success');
              this.dialogRef.close(true);
            } else {
              this.notificationService.showNotification(data.msg, '', 1500, 'danger');
              // $rootScope.isRouteLoading = false;
              // logger.logWarning(data.msg);
            }
          }, err => {
            this.notificationService.showNotification('操作失败', '', 1500, 'danger');
          });
      });

    }
  }

  ngOnInit() {
    this.store = {siteId: this.data.site.value, area: 1000, radius: 10};
    this.storeService.queryLimitRegion().subscribe(result => {
      if (result.success) {
        this.limitLocations = result.obj;
      }
    })
  }

  search() {
    this.searchText2 = this.searchText;
  }
}

// 编辑门店对话框组件
@Component({
  selector: 'app-edit-store-modal-dialog',
  templateUrl: 'edit-store-modal-dialog.html',
})
export class EditStoreModalDialogComponent implements OnInit {

  point: Coordinate = {lat: 0, lng: 0};
  searchText = '';
  searchText2 = '上海';
  BMap: any;
  store: any;
  limitLocations: any;

  constructor(public dialogRef: MatDialogRef<EditStoreModalDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private notificationService: NotificationService,
              private storeService: StoreService) {
    this.point.lng = this.data.longitude;
    this.point.lat = this.data.latitude;
    BaiduMapLoader.load()
      .then(res => {
        this.BMap = res;
      })
  }

  save(): void {
    if (this.point.lat === 0 || this.point.lng === 0) {
      swal({
        title: '请在地图上点选门店地理位置',
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-danger'
      }).catch(swal.noop)
    } else {
      const myGeo = new this.BMap.Geocoder();
      let address: string;
      // 根据坐标得到地址描述
      myGeo.getLocation(new this.BMap.Point(this.point.lng, this.point.lat), result => {
        if (result) {
          address = result.addressComponents.province;
        }
        if ($.inArray(address, provinces) === -1) {
          swal({
            title: '仅限中国大陆地区',
            type: 'error',
            buttonsStyling: false,
            confirmButtonClass: 'btn btn-danger'
          }).catch(swal.noop)
          address = undefined;
          return;
        }
        if (!this.storeService.inLocation(result.addressComponents, this.limitLocations)) {
          swal({
            title: '由于区域保护，您不能将门店移动到此区域,请咨询管理员获得可使用地区信息！',
            type: 'error',
            buttonsStyling: false,
            confirmButtonClass: 'btn btn-danger'
          }).catch(swal.noop)
          address = undefined;
          return;
        }
        this.store.longitude = this.point.lng;
        this.store.latitude = this.point.lat;
        this.storeService.update(this.store)
          .subscribe(data => {
            if (data.success) {
              // 保存门店
              this.notificationService.showNotification('保存成功', '', 1500, 'success');
              this.dialogRef.close(true);
            } else {
              this.notificationService.showNotification(data.msg, '', 1500, 'danger');
              // $rootScope.isRouteLoading = false;
              // logger.logWarning(data.msg);
            }
          }, err => {
            this.notificationService.showNotification('操作失败', '', 1500, 'danger');
          });
      });

    }
  }

  ngOnInit() {
    this.store = this.data;
    this.storeService.queryLimitRegion().subscribe(result => {
      if (result.success) {
        this.limitLocations = result.obj;
      }
    })
  }

  search() {
    this.searchText2 = this.searchText;
  }
}

