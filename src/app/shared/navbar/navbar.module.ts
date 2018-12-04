import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {NavbarComponent} from './navbar.component';
import {MatButtonModule} from '@angular/material';
import {MatInputModule} from '@angular/material';
import {ViewUserInfoModalDialogComponent} from './navbar.component';
import {MatDialogModule} from '@angular/material';

@NgModule({
  imports: [RouterModule, CommonModule, MatButtonModule, MatInputModule, MatDialogModule],
  declarations: [NavbarComponent, ViewUserInfoModalDialogComponent],
  exports: [NavbarComponent],
  entryComponents: [ViewUserInfoModalDialogComponent]
})

export class NavbarModule {
}
