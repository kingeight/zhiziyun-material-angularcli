import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {SidebarComponent} from './sidebar.component';
import {MenuService} from './menu.service';
import {FormsModule} from '@angular/forms';
import {MatChipsModule} from '@angular/material';

@NgModule({
  imports: [RouterModule, CommonModule, FormsModule, MatChipsModule],
  declarations: [SidebarComponent],
  exports: [SidebarComponent],
  providers: [MenuService]
})

export class SidebarModule {
}
