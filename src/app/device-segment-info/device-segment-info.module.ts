import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DeviceSegmentInfoComponent } from './device-segment-info.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../app.module';
import {MyUtilModule} from '../util/my-util.module';
import {DeviceSegmentInfoRoutingModule} from './device-segment-info-routing.module';
import { NewDeviceSegmentInfoComponent } from './new-device-segment-info/new-device-segment-info.component';
import { ViewDeviceSegmentInfoComponent } from './view-device-segment-info/view-device-segment-info.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MyUtilModule,
    MaterialModule,
    DeviceSegmentInfoRoutingModule
  ],
  declarations: [DeviceSegmentInfoComponent, NewDeviceSegmentInfoComponent, ViewDeviceSegmentInfoComponent]
})
export class DeviceSegmentInfoModule { }
