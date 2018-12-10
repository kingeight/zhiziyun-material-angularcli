import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Rx';
import {ActionResult} from '../util/action-result';

// 全局登录用户服务
@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userInfo: any;

  constructor(private http: HttpClient) {
  }

  setUserInfo(userInfo: any) {
    this.userInfo = userInfo;
  }

  getUserInfo() {
    return this.userInfo;
  }

  logOut(): Observable<any> {
    return this.http.post('proxy/loginuser/logout.action', {}, {});
  }

  logInt(email: string, password: string, chkRem: boolean): Observable<ActionResult> {
    return this.http.post<ActionResult>('proxy/loginuser/doLogin.action',
      {email: email, password: password, chkRem: chkRem}, {});
  }

}
