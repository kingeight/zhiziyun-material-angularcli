import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {Routes} from '@angular/router';
import {DeviceVisitorComponent} from './device-visitor.component';
import {StoreProbeResolverService} from './store-probe-resolver.service';
import {DeviceVisitorAllReportComponent} from './device-visitor-all-report/device-visitor-all-report.component';
import {DeviceVisitorTypeReportComponent} from './device-visitor-type-report/device-visitor-type-report.component';
import {DeviceVisitorTimeLengthComponent} from './device-visitor-time-length/device-visitor-time-length.component';
import {DeviceVisitorAttributeComponent} from './device-visitor-attribute/device-visitor-attribute.component';

const deviceVisitorRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'devicevisit',
        component: DeviceVisitorComponent,
        resolve: {
          list: StoreProbeResolverService
        }
      },
      {
        path: 'deVisitAllReport',
        component: DeviceVisitorAllReportComponent
      },
      {
        path: 'deVisitType',
        component: DeviceVisitorTypeReportComponent
      },
      {
        path: 'deVisitTimeLength',
        component: DeviceVisitorTimeLengthComponent
      },
      {
        path: 'deBasicAttr',
        component: DeviceVisitorAttributeComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(deviceVisitorRoutes)
  ],
  exports: [RouterModule]
})
export class DeviceVisitorRoutingModule {
}
