import {AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChange, ViewChild} from '@angular/core';
import {BaiduMapLoader} from '../baidu-map-loader';
import {Coordinate} from '../coordinate';

import * as _ from 'underscore';

@Component({
  selector: 'app-baidu-map-rect',
  templateUrl: './baidu-map-rect.component.html',
  styleUrls: ['./baidu-map-rect.component.scss']
})
export class BaiduMapRectComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() points: Coordinate[];

  @ViewChild('mapDiv') mapDiv;

  BMap: any;

  private overlay: any; // 地图覆盖物

  rendered = false;

  map: any;  // 地图实例

  cache: any;

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    for (const propName in changes) {
      if (propName === 'points') {
        const changedProp = changes[propName];
        if (changedProp.previousValue) {
          this.map.clearOverlays();
          const baiduPoints = [];
          for (let i = 0; i < changedProp.currentValue.length; i++) {
            const tmpP = new this.BMap.Point(changedProp.currentValue[i].lng, changedProp.currentValue[i].lat);
            baiduPoints.push(tmpP);
          }
          const view = (this.map.getViewport(baiduPoints));
          const zoom = this.calcZoom(this.map, view.zoom, baiduPoints,
            view.center);
          this.centerAndZoom(view.center, zoom);
          this.renderAll();
        }
        break;
      }
    }
  }

  ngAfterViewInit() {
    BaiduMapLoader.load()
      .then(res => {
        this.BMap = res;
        this.render();
      })
  }

  centerAndZoom(center: any, zoom: any) {
    this.map.centerAndZoom(center, zoom);
    if (typeof center !== 'string') {
      this.cache = {
        center: center,
        zoom: zoom
      };
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
    this.centerAndZoom('上海', 15);
    const that = this;
    this.map.addEventListener('onload', function () {
      that.map.disableDragging();
      that.map.disableDoubleClickZoom(); // 禁用双击放大
      that.map.addEventListener('resize', function () {
        if (that.cache !== null) {
          that.centerAndZoom(that.cache.center, that.cache.zoom);
        }
      });
      that.map.clearOverlays();
      if (that.points.length === 0) {
        that.centerAndZoom('上海', 15);
      } else {
        const baiduPoints = [];
        for (let i = 0; i < that.points.length; i++) {
          const tmpP = new that.BMap.Point(that.points[i].lng, that.points[i].lat);
          baiduPoints.push(tmpP);
        }
        const view = (that.map.getViewport(baiduPoints));
        const zoom = that.calcZoom(that.map, view.zoom, baiduPoints,
          view.center);
        that.centerAndZoom(view.center, zoom);
        that.renderAll();
      }
    });
  }

  calcZoom(map, zoom, points, center) {
    const distances = _.map(points, function (p) {
      return map.getDistance(p, center)
    })
    const max = _.max(distances)
    const pixelMap = [
      0.7653924583764057,
      1.4522300834310407,
      3.07038858388943,
      6.139309311377578,
      12.27641637744737,
      24.457575856392904,
      48.9602725785222,
      97.76182994235712,
      194.8037565371776,
      387.23133241318453,
      764.0815495427876,
      1487.2828546714245,
      2809.7223841684245,
      4970.702489590681,
      7576.254735334054,
      9021.873992029625
    ];
    while (zoom > 5 && max > 200 * pixelMap[18 - zoom]) {
      zoom = zoom - 1
    }
    return zoom
  }

  renderPoint(n: Coordinate) {
    if (!n) {
      return;
    }
    const circle = new this.BMap.Marker(n);
    this.map.addOverlay(circle)
    this.overlay = circle;
  }

  renderAll() {
    for (let i = 0; i < this.points.length; i++) {
      this.renderPoint(this.points[i]);
    }
  }

}
