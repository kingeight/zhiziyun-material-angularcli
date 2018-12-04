import {NgModule} from '@angular/core';
import {Routes} from '@angular/router';
import {RouterModule} from '@angular/router';

import {AdminLayoutComponent} from './layouts/admin/admin-layout.component';
import {AuthLayoutComponent} from './layouts/auth/auth-layout.component';
import {AuthGuard} from './auth/auth-guard.service';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {WifiSegmentInfoModule} from './wifi-segment-info/wifi-segment-info.module';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  }, {
    path: '',
    component: AdminLayoutComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: './dashboard/dashboard.module#DashboardModule'
      }, {
        path: 'components',
        loadChildren: './components/components.module#ComponentsModule'
      }, {
        path: 'forms',
        loadChildren: './forms/forms.module#Forms'
      }, {
        path: 'tables',
        loadChildren: './tables/tables.module#TablesModule'
      }, {
        path: 'maps',
        loadChildren: './maps/maps.module#MapsModule'
      }, {
        path: 'widgets',
        loadChildren: './widgets/widgets.module#WidgetsModule'
      }, {
        path: 'charts',
        loadChildren: './charts/charts.module#ChartsModule'
      }, {
        path: 'calendar',
        loadChildren: './calendar/calendar.module#CalendarModule'
      }, {
        path: '',
        loadChildren: './userpage/user.module#UserModule'
      }, {
        path: '',
        loadChildren: './timeline/timeline.module#TimelineModule'
      }, {
        path: '',
        loadChildren: './probe/probe.module#ProbeModule'
      }, {
        path: '',
        loadChildren: './device-visitor/device-visitor.module#DeviceVisitorModule'
      }, {
        path: '',
        loadChildren: './device-segment-info/device-segment-info.module#DeviceSegmentInfoModule'
      },
      {
        path: '',
        loadChildren: './adclick-segment-info/adclick-segment-info.module#AdclickSegmentInfoModule'
      },
      {
        path: '',
        loadChildren: './wifi-segment-info/wifi-segment-info.module#WifiSegmentInfoModule'
      }
    ]
  }, {
    path: '',
    component: AuthLayoutComponent,
    children: [{
      path: 'pages',
      loadChildren: './pages/pages.module#PagesModule'
    },
      {path: '**', component: PageNotFoundComponent}]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      {
        enableTracing: true // <-- debugging purposes only

      }
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}
