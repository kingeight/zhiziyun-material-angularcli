import {Injectable} from '@angular/core';
import {HttpInterceptor} from '@angular/common/http';
import {HttpRequest, HttpHandler, HttpEvent} from '@angular/common/http';
import {Observable} from 'rxjs/Rx';
import {HttpParams} from '@angular/common/http';
import {HttpParamsOptions} from '@angular/common/http/src/params';

// 请求拦截器,请求头修改content-type
@Injectable()
export class ContenttypeInterceptor implements HttpInterceptor {

    constructor() {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const newBody = req.body;
        let httpParams = new HttpParams();
        Object.keys(newBody).forEach(function (key) {
            if (newBody[key] instanceof Array) {
                newBody[key].forEach((item, index) => {
                    httpParams = httpParams.append(`${key.toString()}[` + index + `]`, item);
                });
            } else {
                httpParams = httpParams.set(key, newBody[key]);
            }
        });
        // 添加默认的Content-Type为application/json;charset=UTF-8
        const authReq = req.clone({
            body: httpParams.toString(),
            setHeaders: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'}
        });
        // send cloned request with header to the next handler.
        return next.handle(authReq);
    }
}

