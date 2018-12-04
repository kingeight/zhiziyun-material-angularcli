// 报表数据结构
import {ReportMapData} from './report-map-data';

export class ReportMap {
  constructor(public msg: string, public obj: any,
              public reportList: any[],
              public reportMap: ReportMapData,
              public reportMap1: ReportMapData,
              public reportMap2: ReportMapData,
              public success: boolean) {

  }
}
