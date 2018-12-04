import {Injectable} from '@angular/core';
import {HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {HttpResponse, HttpEvent, HttpErrorResponse} from '@angular/common/http';
import {AuthGuard} from '../auth/auth-guard.service';
import {Observable} from 'rxjs/Rx';

// 返回状态拦截器，拦截响应
@Injectable()
export class HttpStatusInterceptor implements HttpInterceptor {

    constructor(private auth: AuthGuard) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).do((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
                // do stuff with response if you want
            }
        }, (err: any) => {
            if (err instanceof HttpErrorResponse) {
                if (err.status === 420) {
                    this.auth.noPermission(req);
                }
            }
        });
    }
}
