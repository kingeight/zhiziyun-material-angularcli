import {BaiduMapComponent} from './baidu-map/baidu-map.component';
import {FullScreenComponent} from './full-screen/full-screen.component';
import {NgModule} from '@angular/core';
import {DateRangePickerComponent} from './date-range-picker/date-range-picker.component';
import {MatInputModule} from '@angular/material';
import {MatButtonModule} from '@angular/material';
import {MatIconModule} from '@angular/material';
import {CommonModule} from '@angular/common';
import {MatAutocompleteModule} from '@angular/material';
import {BaiduMapRectComponent} from './baidu-map-rect/baidu-map-rect.component';
import {WordCloudComponent} from './word-cloud/word-cloud.component';
import {MyWizardDirective} from './my-wizard.directive';

@NgModule({
  imports: [
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatAutocompleteModule,
    CommonModule
  ],
  declarations: [
    BaiduMapComponent,
    FullScreenComponent,
    DateRangePickerComponent,
    BaiduMapRectComponent,
    WordCloudComponent,
    MyWizardDirective
  ],
  exports:
    [
      BaiduMapComponent,
      FullScreenComponent,
      DateRangePickerComponent,
      BaiduMapRectComponent,
      WordCloudComponent,
      MyWizardDirective]
})

export class MyUtilModule {
}
