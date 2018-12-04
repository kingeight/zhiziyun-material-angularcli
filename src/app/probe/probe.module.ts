import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProbeRoutingModule} from './probe-routing.moudle';
import {StoreComponent} from './store/store.component';
import {ProbeComponent} from './probe/probe.component';
import {FormsModule} from '@angular/forms';
import {MaterialModule} from '../app.module';
import {AddStoreModalDialogComponent} from './store/store.component';
import {EditStoreModalDialogComponent} from './store/store.component';
import {MyUtilModule} from '../util/my-util.module';
import {EditProbeModalDialogComponent} from './probe/probe.component';
import {AddProbeModalDialogComponent} from './probe/probe.component';
import {ProbeRadarModalDialogComponent} from './probe/probe.component';

@NgModule({
    imports: [
        CommonModule,
        ProbeRoutingModule,
        FormsModule,
        MaterialModule,
        MyUtilModule
    ],
    declarations: [
        StoreComponent,
        ProbeComponent,
        AddStoreModalDialogComponent,
        EditStoreModalDialogComponent,
        EditProbeModalDialogComponent,
        AddProbeModalDialogComponent,
        ProbeRadarModalDialogComponent
    ],
    entryComponents: [
        AddStoreModalDialogComponent,
        EditStoreModalDialogComponent,
        EditProbeModalDialogComponent,
        AddProbeModalDialogComponent,
        ProbeRadarModalDialogComponent
    ]

})
export class ProbeModule {
}
