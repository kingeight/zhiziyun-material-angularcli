/* "Barrel" of Http Interceptors */
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {ContenttypeInterceptor} from './contenttype-interceptor';
import {HttpStatusInterceptor} from './http-status-interceptor';
import {LoadingInterceptor} from './loading-interceptor';

/** Http interceptor providers in outside-in order */
export const httpInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ContenttypeInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpStatusInterceptor, multi: true},
];
