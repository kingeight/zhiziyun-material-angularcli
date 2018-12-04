import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WifiSegmentInfoComponent } from './wifi-segment-info.component';
import {WifiSegmentInfoRoutingModule} from './wifi-segment-info-routing.module';
import {MyUtilModule} from '../util/my-util.module';
import {FormsModule} from '@angular/forms';
import {MaterialModule} from '../app.module';


@NgModule({
  imports: [
    CommonModule,
    MyUtilModule,
    FormsModule,
    MaterialModule,
    WifiSegmentInfoRoutingModule
  ],
  declarations: [WifiSegmentInfoComponent]
})
export class WifiSegmentInfoModule { }
