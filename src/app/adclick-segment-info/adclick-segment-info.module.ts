import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  AdclickSegmentInfoComponent, AddAdclickSegmentInfoModalDialogComponent,
  ViewAdclickSegmentInfoModalDialogComponent
} from './adclick-segment-info.component';
import {MaterialModule} from '../app.module';
import {FormsModule} from '@angular/forms';
import {MyUtilModule} from '../util/my-util.module';
import {RouterModule} from '@angular/router';
import {AdclickSegmentInfoRoutingModule} from './adclick-segment-info-routing-module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MyUtilModule,
    MaterialModule,
    AdclickSegmentInfoRoutingModule
  ],
  declarations: [AdclickSegmentInfoComponent, ViewAdclickSegmentInfoModalDialogComponent,
    AddAdclickSegmentInfoModalDialogComponent],
  entryComponents: [ViewAdclickSegmentInfoModalDialogComponent, AddAdclickSegmentInfoModalDialogComponent]
})
export class AdclickSegmentInfoModule {
}
