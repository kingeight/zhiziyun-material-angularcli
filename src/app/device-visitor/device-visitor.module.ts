import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DeviceVisitorRoutingModule} from './device-visitor-routing.module';
import {DeviceVisitorComponent} from './device-visitor.component';
import {MyUtilModule} from '../util/my-util.module';
import {FormsModule} from '@angular/forms';
import {MaterialModule} from '../app.module';
import {FilterProbeByStorePipe} from './filter-probe-by-store.pipe';
import {VisitorDetailModalDialogComponent} from './device-visitor.component';
import {DeviceVisitorAllReportComponent} from './device-visitor-all-report/device-visitor-all-report.component';
import {DeviceVisitorAllReportByHourComponent} from './device-visitor-all-report/device-visitor-all-report-by-hour/device-visitor-all-report-by-hour.component';
import {ChartsModule} from 'ng2-charts';
import { DeviceVisitorAllReportByDayComponent } from './device-visitor-all-report/device-visitor-all-report-by-day/device-visitor-all-report-by-day.component';
import { DeviceVisitorTypeReportComponent } from './device-visitor-type-report/device-visitor-type-report.component';
import { DeviceVisitorTypeReportByTypeComponent } from './device-visitor-type-report/device-visitor-type-report-by-type/device-visitor-type-report-by-type.component';
import { DeviceVisitorTypeReportByActivityComponent } from './device-visitor-type-report/device-visitor-type-report-by-activity/device-visitor-type-report-by-activity.component';
import { DeviceVisitorTimeLengthComponent } from './device-visitor-time-length/device-visitor-time-length.component';
import { DeviceVisitorAttributeComponent } from './device-visitor-attribute/device-visitor-attribute.component';
import { DeviceVisitorBasicAttributeComponent } from './device-visitor-attribute/device-visitor-basic-attribute/device-visitor-basic-attribute.component';
import { DeviceVisitorDeviceAttributeComponent } from './device-visitor-attribute/device-visitor-device-attribute/device-visitor-device-attribute.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MyUtilModule,
    MaterialModule,
    DeviceVisitorRoutingModule,
    ChartsModule
  ],
  declarations: [
    DeviceVisitorComponent,
    FilterProbeByStorePipe,
    VisitorDetailModalDialogComponent,
    DeviceVisitorAllReportComponent,
    DeviceVisitorAllReportByHourComponent,
    DeviceVisitorAllReportByDayComponent,
    DeviceVisitorTypeReportComponent,
    DeviceVisitorTypeReportByTypeComponent,
    DeviceVisitorTypeReportByActivityComponent,
    DeviceVisitorTimeLengthComponent,
    DeviceVisitorAttributeComponent,
    DeviceVisitorBasicAttributeComponent,
    DeviceVisitorDeviceAttributeComponent
  ],
  entryComponents: [
    VisitorDetailModalDialogComponent
  ]
})
export class DeviceVisitorModule {
}
