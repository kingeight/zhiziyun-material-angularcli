import {Injectable} from '@angular/core';
import {HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {HttpEvent} from '@angular/common/http';
import {LoadingScreenService} from '../util/loading-screen.service';
import {Observable} from 'rxjs/Rx';

// 锁屏拦截器，当出现网络加载的时候锁屏
@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

    constructor(private loadingScreenService: LoadingScreenService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.loadingScreenService.show(100);
        return next.handle(req).finally(() => {
            this.loadingScreenService.hide();
        });
    }
}
