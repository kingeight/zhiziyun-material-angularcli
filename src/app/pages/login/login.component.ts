import {Component, OnInit, ElementRef, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../../auth/user.service';
import {NotificationService} from '../../util/notification/notification.service';
import {AuthService} from '../../auth/auth.service';


declare var $: any;

@Component({
  selector: 'app-login-cmp',
  templateUrl: './login.component.html',
  styles: ['.form-control.chkRem{background:none;padding-left:20px;}']
})

export class LoginComponent implements OnInit, OnDestroy {
  test: Date = new Date();
  private toggleButton: any;
  private sidebarVisible: boolean;
  private nativeElement: Node;
  chkRem = false;
  email = '';
  password = '';

  constructor(private element: ElementRef, private userService: UserService,
              private notificationService: NotificationService,
              private authService: AuthService,
              private router: Router) {
    this.nativeElement = element.nativeElement;
    this.sidebarVisible = false;
    this.authService.login()
      .subscribe(res => {
        if (res) {
          // 已登录则跳转到首页
          this.router.navigate(['/dashboard']);
        }
      })
  }

  ngOnInit() {
    const navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
    const body = document.getElementsByTagName('body')[0];
    body.classList.add('login-page');
    body.classList.add('off-canvas-sidebar');
    const card = document.getElementsByClassName('card')[0];
    setTimeout(function () {
      // after 1000 ms we add the class animated to the login/register card
      card.classList.remove('card-hidden');
    }, 700);
  }

  sidebarToggle() {
    const toggleButton = this.toggleButton;
    const body = document.getElementsByTagName('body')[0];
    const sidebar = document.getElementsByClassName('navbar-collapse')[0];
    if (this.sidebarVisible === false) {
      setTimeout(function () {
        toggleButton.classList.add('toggled');
      }, 500);
      body.classList.add('nav-open');
      this.sidebarVisible = true;
    } else {
      this.toggleButton.classList.remove('toggled');
      this.sidebarVisible = false;
      body.classList.remove('nav-open');
    }
  }

  login() {
    this.userService.logInt(this.email, this.password, this.chkRem)
      .subscribe(res => {
        if (res.success) {
          this.userService.setUserInfo(res.obj);
          this.router.navigate(['/dashboard']);
        } else {
          this.notificationService.showNotification(res.msg, '', 1500, 'danger');
        }
      });
  }

  ngOnDestroy() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('login-page');
    body.classList.remove('off-canvas-sidebar');
  }
}
