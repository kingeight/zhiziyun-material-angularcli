import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {WifiSegmentInfoComponent} from './wifi-segment-info.component';

const wifiSegmentInfoRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'wifiSegmentInfo',
        component: WifiSegmentInfoComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(wifiSegmentInfoRoutes)
  ],
  exports: [RouterModule]
})
export class WifiSegmentInfoRoutingModule { }
