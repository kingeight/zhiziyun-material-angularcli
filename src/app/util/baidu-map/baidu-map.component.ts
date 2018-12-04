import {Component, Input, OnInit, OnChanges, SimpleChange, ViewChild, AfterViewInit} from '@angular/core';
import {Coordinate} from '../coordinate';
import {BaiduMapLoader} from '../../util/baidu-map-loader';

// 百度地图组件
@Component({
    selector: 'app-baidu-map',
    templateUrl: './baidu-map.component.html',
    styleUrls: ['./baidu-map.component.scss']
})
export class BaiduMapComponent implements OnInit, OnChanges, AfterViewInit {

    @Input() point: Coordinate;

    @Input() scaleSupported;

    private _keywords: string;

    @ViewChild('mapDiv') mapDiv;

    @Input()
    set keywords(keywords: string) {
        this._keywords = keywords && keywords.trim();
    }

    get keywords(): string {
        return this._keywords;
    }

    BMap: any;

    private overlay: any; // 地图覆盖物

    rendered = false;

    map: any;  // 地图实例

    constructor() {
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        BaiduMapLoader.load()
            .then(res => {
                this.BMap = res;
                this.render();
            })
    }

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        for (const propName in changes) {
            if (propName === 'keywords') {
                const changedProp = changes[propName];
                if (changedProp.previousValue) {
                    this.map.centerAndZoom(changedProp.currentValue, 18);
                }
                break;
            }
        }
    }

    render() {
        this.map = new this.BMap.Map(
            this.mapDiv.nativeElement, {
                enableMapClick: false,
                minZoom: 5,
                maxZoom: 18,
                enableAutoResize: false,
            }
        );
        // 必须先调用centerAndZoom初始化
        if (this.point && this.point.lat && this.point.lng) {
            this.map.centerAndZoom(new this.BMap.Point(this.point.lng, this.point.lat), 18);
            this.renderPoint(this.point);
        } else {
            this.map.centerAndZoom('上海', 15);
        }

        if (this.scaleSupported) {
            // map.enableScrollWheelZoom(true); //可以用滚轮缩放
            this.map.addControl(new this.BMap.NavigationControl());
            this.map.addControl(new this.BMap.CityListControl({
                anchor: this.BMap.BMAP_ANCHOR_TOP_RIGHT
            }));
        } else {
            this.map.disableDragging();
        }
        this.map.disableDoubleClickZoom(); // 禁用双击放大

        if (this.scaleSupported && this.point) {
            const that = this;
            this.map.addEventListener('click', function (e) {
                that.point.lat = e.point.lat;
                that.point.lng = e.point.lng;
                that.renderPoint(e.point);
            });
        }
    }

    renderPoint(n: Coordinate) {
        if (!n) {
            return;
        }
        const circle = new this.BMap.Marker(n);
        if (this.overlay) {
            this.map.removeOverlay(this.overlay);
        }
        this.map.addOverlay(circle)
        this.overlay = circle;
    }

}


