import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {HttpModule} from '@angular/http';
import {HttpClientModule} from '@angular/common/http';
import {APP_BASE_HREF} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {UserService} from './auth/user.service';
import {WebSiteService} from './web-site.service';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatStepperModule,
  MatPaginatorIntl,
  MAT_DIALOG_DEFAULT_OPTIONS // 对话框默认配置
} from '@angular/material';
import {MatDatepickerModule} from '@angular/material/datepicker';

import {AppComponent} from './app.component';

import {SidebarModule} from './sidebar/sidebar.module';
import {FooterModule} from './shared/footer/footer.module';
import {NavbarModule} from './shared/navbar/navbar.module';
import {FixedpluginModule} from './shared/fixedplugin/fixedplugin.module';
import {AdminLayoutComponent} from './layouts/admin/admin-layout.component';
import {AuthLayoutComponent} from './layouts/auth/auth-layout.component';

import {AppRoutingModule} from './app-routing.module';
import {AuthGuard} from './auth/auth-guard.service';
import {AuthService} from './auth/auth.service';

import {httpInterceptorProviders} from './http-interceptors';
import {MatPaginatorIntlCus} from './util/mat-paginator-intl-cus';
import {ChartsModule} from 'ng2-charts';
import {MyUtilModule} from './util/my-util.module';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';

@NgModule({
  exports: [
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
  ]
})
export class MaterialModule {
}

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    MaterialModule,
    MatNativeDateModule,
    SidebarModule,
    NavbarModule,
    FooterModule,
    FixedpluginModule,
    AppRoutingModule,
    ChartsModule, // 基于chart.js的数据可视化模块
    MyUtilModule // 自定义工具，包含组件  服务
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    PageNotFoundComponent
  ],
  providers: [
    UserService,
    AuthGuard,
    AuthService,
    WebSiteService,
    httpInterceptorProviders,
    {provide: MatPaginatorIntl, useClass: MatPaginatorIntlCus}, // 翻页配置
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {minWidth: '40vw', hasBackdrop: true, maxWidth: '90vw'}}  // 对话框配置
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
