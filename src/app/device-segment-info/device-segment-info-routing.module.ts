import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {Routes} from '@angular/router';
import {DeviceSegmentInfoComponent} from './device-segment-info.component';
import {NewDeviceSegmentInfoComponent} from './new-device-segment-info/new-device-segment-info.component';
import {DeviceSegmentInfoResolverService} from './device-segment-info-resolver.service';
import {ViewDeviceSegmentInfoComponent} from './view-device-segment-info/view-device-segment-info.component';

const deviceSegmentInfoRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'devicesegmentinfo',
        component: DeviceSegmentInfoComponent
      },
      {
        path: 'newdevicesegmentinfo',
        component: NewDeviceSegmentInfoComponent,
        resolve: {
          resolveData: DeviceSegmentInfoResolverService
        }
      },
      {
        path: 'viewdevicesegmentinfo/:segmentId',
        component: ViewDeviceSegmentInfoComponent,
        resolve: {
          resolveData: DeviceSegmentInfoResolverService
        }
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(deviceSegmentInfoRoutes)
  ],
  exports: [RouterModule]
})
export class DeviceSegmentInfoRoutingModule {
}
