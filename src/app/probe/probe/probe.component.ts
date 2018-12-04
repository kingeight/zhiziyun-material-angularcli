import {Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {switchMap} from 'rxjs/internal/operators';
import {ProbeService} from './probe.service';
import {WebSiteService} from '../../web-site.service';
import {Subscription} from 'rxjs/Rx';
import swal from 'sweetalert2';
import {NotificationService} from '../../util/notification/notification.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, PageEvent} from '@angular/material';
import {Coordinate} from '../../util/coordinate';
import {Overlay} from '@angular/cdk/overlay';
import {CustomNumberRangeErrorStateMatcher} from '../../util/validator/custom-number-range-error-state-matcher';
import {MatTable} from '@angular/material';
import {StoreService} from '../store/store.service';
import {CustomConfirmErrorStateMatcher} from '../../util/validator/custom-confirm-error-state-matcher';
import * as d3 from 'd3';
import {take} from 'rxjs/internal/operators';
import {map} from 'rxjs/internal/operators';
import {interval} from 'rxjs/index';
import {DeviceVisitorService} from '../../device-visitor/device-visitor.service';
import * as moment from 'moment';

@Component({
    selector: 'app-probe',
    templateUrl: './probe.component.html',
    styleUrls: ['./probe.component.scss']
})
export class ProbeComponent implements OnInit, OnDestroy {

    subscription: Subscription;

    storeId: number;
    store: any;

    probeList: any[];

    searchText = '';

    page = 0;
    rows = 10;
    total = 0;

    selectedDockedStatus: boolean;

    radius = 1;

    dockedStatus = [{text: '全部', value: undefined}, {text: '已接入', value: true}, {text: '未接入', value: false}]; // 接入状态

    displayedColumns: any[] = ['name', 'mac', 'docked', 'radius', 'active', 'bindTime', 'actions'];

    @ViewChild(MatTable) table: MatTable<any>;

    constructor(private webSiteService: WebSiteService,
                private probeService: ProbeService,
                private route: ActivatedRoute,
                private notificationService: NotificationService,
                private router: Router,
                public dialog: MatDialog, private overlay: Overlay,
                private storeService: StoreService) {
        this.subscription = this.webSiteService.getMessage().subscribe(site => { // 所选网站变化事件，所有跟site相关的数据都应该在这里执行
            console.log(site);
            // 跳转到门店列表
            this.router.navigate(['/store']);
        });
    }

    ngOnInit() {
        this.route.paramMap.pipe(
            switchMap((params: ParamMap) => {
                this.storeId = +params.get('id');
                this.storeService.select(this.storeId).subscribe(data => {
                    this.store = data.obj;
                });
                return this.probeService.list(this.storeId, this.webSiteService.getCurrentSelectedSite().value,
                    this.searchText, this.page + 1, this.rows, this.selectedDockedStatus);
            })
        ).subscribe(data => {
            this.probeList = this.calculateRadius(data.rows);
            this.total = data.total;
        });
    }

    getProbeList(e: PageEvent = null) {
        if (e != null) {
            this.page = e.pageIndex;
            this.rows = e.pageSize;
        }
        this.probeService.list(this.storeId, this.webSiteService.getCurrentSelectedSite().value,
            this.searchText, this.page + 1, this.rows, this.selectedDockedStatus)
            .subscribe(data => {
                this.probeList = this.calculateRadius(data.rows);
                this.total = data.total;
            });
    }

    searchProbe() {
        this.page = 0;
        this.getProbeList();
    }

    // 根据探针覆盖面积计算覆盖半径
    calculateRadius(list: any[]): any[] {
        for (let i = 0; i < list.length; i++) {
            list[i].radius = Math.floor(Math.sqrt(list[i].floorArea / 3.14));
        }
        return list;
    }

    // 更改探针接入状态
    toggleStatus(probe: any, index: number) {
        swal({
            title: '确认要修改状态为未接入吗？',
            text: '已接入的探针将无法进行修改!',
            type: 'warning',
            showCancelButton: true,
            confirmButtonClass: 'btn btn-success',
            cancelButtonClass: 'btn btn-danger',
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            buttonsStyling: false
        }).then((result) => {
            if (result.value) {
                this.probeService.toggleStatus(probe['id']).subscribe(data => {
                    if (data.success) {
                        this.notificationService.showNotification(data.msg, '', 1500, 'success');
                    } else {
                        this.probeList[index].docked = !this.probeList[index].docked;
                        this.notificationService.showNotification(data.msg, '错误', 1500, 'danger');
                    }
                })
            } else {
                this.probeList[index].docked = !this.probeList[index].docked;
            }
        })
    }

    // 编辑探针弹窗
    openEditProbeDialog(index: number): void {
        const dialogRef = this.dialog.open(EditProbeModalDialogComponent, {
            data: this.probeList[index],
            disableClose: true
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.probeList[index] = result;
                this.table.renderRows(); // 刷新列表
            }
        });
    }

    // 绑定探针弹窗
    openAddProbeDialog(index: number): void {
        const dialogRef = this.dialog.open(AddProbeModalDialogComponent, {
            data: {store: this.store, siteId: this.webSiteService.getCurrentSelectedSite().value},
            disableClose: true,
            hasBackdrop: true
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.searchProbe();
            }
        });
    }

    // 探针雷达图
    showProbeRadarDialog(probe: any): void {
        const dialogRef = this.dialog.open(ProbeRadarModalDialogComponent, {
            data: {probe: probe},
            scrollStrategy: this.overlay.scrollStrategies.noop(),
            width: '800px'
        });
    }

    // 解绑探针
    delProbe(id: number) {
        swal({
            title: '',
            text: '确定要解绑该探针吗？',
            type: 'warning',
            showCancelButton: true,
            confirmButtonClass: 'btn btn-success',
            cancelButtonClass: 'btn btn-danger',
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            buttonsStyling: false
        }).then((result) => {
            if (result.value) {
                this.probeService.unbind(id).subscribe(data => {
                    if (data.success) {
                        this.notificationService.showNotification(data.msg, '', 1500, 'success');
                        this.getProbeList();
                    } else {
                        this.notificationService.showNotification(data.msg, '错误', 1500, 'danger');
                    }
                })
            }
        })
    }


    // 一定要在组件注销时取消订阅
    ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        this.subscription.unsubscribe();
    }

}

// 编辑探针对话框组件
@Component({
    selector: 'app-edit-probe-modal-dialog',
    templateUrl: 'edit-probe-modal-dialog.html',
})
export class EditProbeModalDialogComponent implements OnInit {

    point: Coordinate = {lat: 0, lng: 0};
    probe: any;
    minMatcher = new CustomNumberRangeErrorStateMatcher(3, 100);
    cloneProbe: any;
    Math: any;

    constructor(public dialogRef: MatDialogRef<EditProbeModalDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private notificationService: NotificationService,
                private probeService: ProbeService) {
        this.cloneProbe = JSON.parse(JSON.stringify(this.data));
        this.point.lng = this.data.longitude;
        this.point.lat = this.data.latitude;
        this.Math = Math;
    }

    save(): void {
        this.probe.floorArea = Math.PI * this.probe.radius * this.probe.radius;
        this.probe.longitude = this.point.lng;
        this.probe.latitude = this.point.lat;
        this.probe.signalStrength = this.probeService.getSignalFromRadius(this.probe.radius);
        this.probeService.update(this.probe)
            .subscribe(data => {
                if (data.success) {
                    this.notificationService.showNotification('编辑成功', '', 1500, 'success');
                    this.dialogRef.close(this.probe);
                } else {
                    this.notificationService.showNotification(data.msg, '', 1500, 'danger');
                }
            }, err => {
                this.notificationService.showNotification('操作失败', '', 1500, 'danger');
            });
    }

    ngOnInit() {
        this.probe = this.cloneProbe;
    }
}

// 绑定探针对话框组件
@Component({
    selector: 'app-add-probe-modal-dialog',
    templateUrl: 'add-probe-modal-dialog.html',
})
export class AddProbeModalDialogComponent {

    point: Coordinate = {lat: 0, lng: 0};
    probe: any;
    minMatcher = new CustomNumberRangeErrorStateMatcher(3, 100);
    confirmMatcher = new CustomConfirmErrorStateMatcher('mac');
    confirmMac: string; // 确认探针识别码
    Math: any;

    constructor(public dialogRef: MatDialogRef<AddProbeModalDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private notificationService: NotificationService,
                private probeService: ProbeService) {
        this.probe = {siteId: this.data.siteId};
        this.point.lng = this.probe.longitude = this.data.store.longitude;
        this.point.lat = this.probe.latitude = this.data.store.latitude;
        this.probe.storeId = this.data.store['id'];
        this.confirmMac = '';
        this.Math = Math;
    }

    save(): void {
        this.probe.floorArea = Math.PI * this.probe.radius * this.probe.radius;
        this.probe.signalStrength = this.probeService.getSignalFromRadius(this.probe.radius);
        this.probeService.add(this.probe)
            .subscribe(data => {
                if (data.success) {
                    // 保存探针
                    this.notificationService.showNotification('保存成功', '', 1500, 'success');
                    this.dialogRef.close(true);
                } else {
                    this.notificationService.showNotification(data.msg, '', 1500, 'danger');
                }
            }, err => {
                this.notificationService.showNotification('操作失败', '', 1500, 'danger');
            });
    }
}

// 绑定探针对话框组件
@Component({
    selector: 'app-show-probe-radar-modal-dialog',
    templateUrl: 'probe-radar.html',
    styleUrls: ['./probe.component.scss']
})
export class ProbeRadarModalDialogComponent implements OnInit, OnDestroy {

    point: Coordinate = {lat: 0, lng: 0};
    probe: any;
    circleInterval: any;
    rows: any[];
    devices: any[] = [];
    total = 0;

    constructor(public dialogRef: MatDialogRef<ProbeRadarModalDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any, private deviceVisitorService: DeviceVisitorService) {
        this.probe = this.data.probe;
        this.point.lng = this.probe.longitude;
        this.point.lat = this.probe.latitude;
    }


    renderRadar() {
        const maxrssi = d3.max(this.rows, function (item) {
            return item.rssi;
        });
        const ary = [];
        ary.push(this.total);
        this.rows.forEach(function (item, index) {
            const r = (1 - Math.random() * 0.5) * 200 * item.rssi / maxrssi;
            const cx = Math.random() * r * (Math.random() > 0.5 ? 1 : -1);
            const cy = Math.sqrt(r * r - cx * cx) * (Math.random() > 0.5 ? 1 : -1);
            item.cx = cx;
            item.cy = cy;
        });
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
        interval(1500)
            .pipe(
                take(this.rows.length),
                map(i => this.rows[i])
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

    ngOnInit() {
        const now = moment();
        this.deviceVisitorService.list({
            page: 1,
            rows: 50,
            starttime: now.format('YYYY-MM-DD') + ' 00:00:01',
            endtime: now.format('YYYY-MM-DD') + ' 23:59:59',
            siteId: this.probe.siteId,
            sort: 'visittime',
            order: 'desc',
            macs: [this.probe.mac]
        }).subscribe(res => {
            this.rows = res.rows;
            this.total = res.total;
            this.renderRadar();
        });
    }

    save(): void {
        this.dialogRef.close(true);
    }

    ngOnDestroy() {
        if (this.circleInterval) {
            clearInterval(this.circleInterval);
        }
    }
}
