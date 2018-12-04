import {Injectable} from '@angular/core';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import {AuthService} from './auth.service';
import {UserService} from './user.service';
import {HttpRequest} from '@angular/common/http';
import {WebSiteService} from '../web-site.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService,
              private router: Router,
              private userService: UserService,
              private webSiteService: WebSiteService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const url: string = state.url;

    return this.checkLogin(url);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }

  // 无权发起该请求（请求状态420）
  noPermission(req: HttpRequest<any>) {
    console.log('无权访问该页面:' + req.url);
    this.router.navigate(['/pages/login']);
  }

  // 登录状态过期（请求状态419）
  hasNotLogin(req: HttpRequest<any>) {
    console.log('无权访问该页面:' + req.url);
    this.router.navigate(['/pages/login']);
  }

  // 其他错误（请求状态非200）
  someSeriousMistake(req: HttpRequest<any>) {
    console.log('无权访问该页面:' + req.url);
    this.router.navigate(['/pages/login']);
  }


  checkLogin(url: string): boolean {
    if (this.authService.isLoggedIn) {
      return true;
    }

    this.authService.login().subscribe(user => {
      if (!user) {
        // 跳转到登录
        alert('没有登录');
        return false;
      } else {
        this.authService.isLoggedIn = true;
        this.userService.setUserInfo(user);
        this.webSiteService.getCurrentSite().subscribe(sites => {
          this.webSiteService.setSites(sites);
          if (sites.length > 0) {
            this.webSiteService.setSite(sites[0], false);
          } else {
            this.webSiteService.setSite({});
          }
          this.router.navigate([url]);
          return true;
        });

      }
    });
    // Store the attempted URL for redirecting
    // this.authService.redirectUrl = url;

    // Navigate to the login page with extras
    // this.router.navigate(['/login']);
    // return false;
  }
}
