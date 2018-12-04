import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {Routes} from '@angular/router';
import {AdclickSegmentInfoComponent} from './adclick-segment-info.component';

const adclickSegmentInfoRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'adClickSegmentInfo',
        component: AdclickSegmentInfoComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(adclickSegmentInfoRoutes)
  ],
  exports: [RouterModule]
})
export class AdclickSegmentInfoRoutingModule {
}
