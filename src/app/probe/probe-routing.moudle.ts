import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {Routes} from '@angular/router';
import {StoreComponent} from './store/store.component';
import {ProbeComponent} from './probe/probe.component';

const probeRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'store',
                component: StoreComponent
            },
            {
                path: 'store/:id',
                component: ProbeComponent
            }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(probeRoutes)
    ],
    exports: [RouterModule]
})
export class ProbeRoutingModule {
}
