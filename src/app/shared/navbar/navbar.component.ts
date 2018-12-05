import {Component, OnInit, Renderer, ViewChild, ElementRef, Directive, Inject} from '@angular/core';
import {ROUTES} from '../.././sidebar/sidebar.component';
import {Router, ActivatedRoute, NavigationEnd, NavigationStart} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import {Observable} from 'rxjs/Rx';
import {map, filter, debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {ajax} from 'rxjs/internal/observable/dom/ajax';

import {WebSiteService} from '../../web-site.service';
import {from} from 'rxjs/index';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {Overlay} from '@angular/cdk/overlay';
import {UserService} from '../../auth/user.service';

const misc: any = {
  navbar_menu_visible: 0,
  active_collapse: true,
  disabled_collapse_init: 0,
};

declare var $: any;

@Component({
  selector: 'app-navbar-cmp',
  templateUrl: 'navbar.component.html',
  styles: ['.example-form-field{width:100%}']
})

export class NavbarComponent implements OnInit {
  private listTitles: any[];
  location: Location;
  mobile_menu_visible: any = 0;
  private nativeElement: Node;
  private toggleButton: any;
  private sidebarVisible: boolean;
  private _router: Subscription;
  currentSite: any;
  currentSites: any[];
  private searchSites: any[];
  searchIng: boolean;
  parentPath = null;
  parentTitle = null;
  title = null;

  @ViewChild('app-navbar-cmp') button: any;

  constructor(location: Location, private renderer: Renderer, private element: ElementRef,
              private router: Router, private route: ActivatedRoute, private webSiteService: WebSiteService,
              private dialog: MatDialog, private overlay: Overlay,
              private userService: UserService) {
    this.location = location;
    this.nativeElement = element.nativeElement;
    this.sidebarVisible = false;
    this.currentSite = {};
    this.searchSites = [];
    this.searchIng = false;
    this.listTitles = ROUTES;
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.parentPath = null;
        this.parentTitle = null;
        this.getTitle();
      }
    });
  }

  minimizeSidebar() {
    const body = document.getElementsByTagName('body')[0];

    if (misc.sidebar_mini_active === true) {
      body.classList.remove('sidebar-mini');
      misc.sidebar_mini_active = false;

    } else {
      setTimeout(function () {
        body.classList.add('sidebar-mini');

        misc.sidebar_mini_active = true;
      }, 300);
    }

    // we simulate the window Resize so the charts will get updated in realtime.
    const simulateWindowResize = setInterval(function () {
      window.dispatchEvent(new Event('resize'));
    }, 180);

    // we stop the simulation of Window Resize after the animations are completed
    setTimeout(function () {
      clearInterval(simulateWindowResize);
    }, 1000);
  }

  hideSidebar() {
    const body = document.getElementsByTagName('body')[0];
    const sidebar = document.getElementsByClassName('sidebar')[0];

    if (misc.hide_sidebar_active === true) {
      setTimeout(function () {
        body.classList.remove('hide-sidebar');
        misc.hide_sidebar_active = false;
      }, 300);
      setTimeout(function () {
        sidebar.classList.remove('animation');
      }, 600);
      sidebar.classList.add('animation');

    } else {
      setTimeout(function () {
        body.classList.add('hide-sidebar');
        // $('.sidebar').addClass('animation');
        misc.hide_sidebar_active = true;
      }, 300);
    }

    // we simulate the window Resize so the charts will get updated in realtime.
    const simulateWindowResize = setInterval(function () {
      window.dispatchEvent(new Event('resize'));
    }, 180);

    // we stop the simulation of Window Resize after the animations are completed
    setTimeout(function () {
      clearInterval(simulateWindowResize);
    }, 1000);
  }

  ngOnInit() {
    // this.route.data.subscribe((data: { sites: any }) => {
    //         if (data.sites.length > 0) {
    //             this.currentSite = data.sites[0];
    //             this.webSiteService.setSite(data.sites[0], false);
    //             this.currentSites = data.sites;
    //         } else {
    //             this.currentSite = {};
    //             this.webSiteService.setSite({});
    //             this.currentSites = [];
    //         }
    //     }
    // );
    if (this.webSiteService.getSites().length > 0) {
      this.currentSite = this.webSiteService.getSites()[0];
      this.currentSites = this.webSiteService.getSites();
    } else {
      this.currentSite = {};
      this.currentSites = [];
    }
    const navbar: HTMLElement = this.element.nativeElement;
    const body = document.getElementsByTagName('body')[0];
    this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
    if (body.classList.contains('sidebar-mini')) {
      misc.sidebar_mini_active = true;
    }
    if (body.classList.contains('hide-sidebar')) {
      misc.hide_sidebar_active = true;
    }
    this._router = this.router.events.filter(event => event instanceof NavigationEnd).subscribe((event: NavigationEnd) => {
      this.sidebarClose();

      const $layer = document.getElementsByClassName('close-layer')[0];
      if ($layer) {
        $layer.remove();
      }
    });


    const searchBox = document.getElementById('siteSearchBox');
    // const typeahead = fromEvent(searchBox, 'keyup').pipe(
    //     map((e: KeyboardEvent) => (<HTMLInputElement>e.target).value),
    //     filter(text => text.length > 2),
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     switchMap(text => ajax.post('/options/searchSiteOption.action', {'searchCode': text}))
    // );

    Observable.combineLatest(
      Observable.merge(
        Observable.fromEvent(searchBox, 'compositionstart').map(() => true),
        Observable.fromEvent(searchBox, 'compositionend').map(() => false)
      ).startWith(false),
      Observable.fromEvent(searchBox, 'keyup')
    ).filter(array => array[0] === false)
      .map(array => array[1])
      .map((event: KeyboardEvent) => (<HTMLInputElement>event.target).value)
      .filter(text => text.length > 2)
      .debounceTime(250)
      .distinctUntilChanged()
      .switchMap(text => {
        this.searchIng = true;
        return ajax.post('/options/searchSiteOption.action', {'searchCode': text});
      })
      .subscribe(xhr => {
        this.searchIng = false;
        const sites = xhr.response
        this.searchSites = sites;
      });

  }

  onResize(event) {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }

  sidebarOpen() {
    const $toggle = document.getElementsByClassName('navbar-toggler')[0];
    const toggleButton = this.toggleButton;
    const body = document.getElementsByTagName('body')[0];
    setTimeout(function () {
      toggleButton.classList.add('toggled');
    }, 500);
    body.classList.add('nav-open');
    setTimeout(function () {
      $toggle.classList.add('toggled');
    }, 430);

    const $layer = document.createElement('div');
    $layer.setAttribute('class', 'close-layer');


    if (body.querySelectorAll('.main-panel')) {
      document.getElementsByClassName('main-panel')[0].appendChild($layer);
    } else if (body.classList.contains('off-canvas-sidebar')) {
      document.getElementsByClassName('wrapper-full-page')[0].appendChild($layer);
    }

    setTimeout(function () {
      $layer.classList.add('visible');
    }, 100);

    $layer.onclick = function () { // asign a function
      body.classList.remove('nav-open');
      this.mobile_menu_visible = 0;
      this.sidebarVisible = false;

      $layer.classList.remove('visible');
      setTimeout(function () {
        $layer.remove();
        $toggle.classList.remove('toggled');
      }, 400);
    }.bind(this);

    body.classList.add('nav-open');
    this.mobile_menu_visible = 1;
    this.sidebarVisible = true;
  };

  sidebarClose() {
    const $toggle = document.getElementsByClassName('navbar-toggler')[0];
    const body = document.getElementsByTagName('body')[0];
    this.toggleButton.classList.remove('toggled');
    const $layer = document.createElement('div');
    $layer.setAttribute('class', 'close-layer');

    this.sidebarVisible = false;
    body.classList.remove('nav-open');
    // $('html').removeClass('nav-open');
    body.classList.remove('nav-open');
    if ($layer) {
      $layer.remove();
    }

    setTimeout(function () {
      $toggle.classList.remove('toggled');
    }, 400);

    this.mobile_menu_visible = 0;
  };

  sidebarToggle() {
    if (this.sidebarVisible === false) {
      this.sidebarOpen();
    } else {
      this.sidebarClose();
    }
  }

  getTitle() {
    const titlee: any = this.location.prepareExternalUrl(this.location.path());
    for (let i = 0; i < this.listTitles.length; i++) {
      const r = new RegExp('^' + this.listTitles[i].path + '$', 'ig');
      if (this.listTitles[i].path === titlee || r.test(titlee)) {
        return this.title = this.listTitles[i].title;
      } else if (this.listTitles[i].type === 'sub') {
        for (let j = 0; j < this.listTitles[i].children.length; j++) {
          const subtitle = this.listTitles[i].children[j].path;
          const re = new RegExp('^' + this.listTitles[i].children[j].path + '$', 'ig');
          if (subtitle === titlee || re.test(titlee)) {
            this.parentPath = this.listTitles[i].path;
            this.parentTitle = this.listTitles[i].title;
            return this.title = this.listTitles[i].children[j].title;
          }
        }
      }
    }
    return this.title = 'Dashboard';
  }

  getPath() {
    return this.location.prepareExternalUrl(this.location.path());
  }

  getSite() {
    this.webSiteService.getCurrentSite().subscribe(sites => {
      if (sites.length > 0) {
        this.currentSite = sites[0];
        this.webSiteService.setSite(sites[0]);
        this.currentSites = sites;
      } else {
        this.currentSite = {};
        this.webSiteService.setSite({});
        this.currentSites = [];
      }
    });
  }

  choseSite(site: any) {
    let contains = false;
    Observable.from(this.currentSites).forEach(value => {
      if (value.value === site.value) {
        contains = true;
      }
    }).then(() => {
      if (!contains) {
        this.currentSites.push(site);
      }
    });
    this.currentSite = site;
    this.webSiteService.setSite(site);
  }

  showUserInfo() {
    const dialogRef = this.dialog.open(ViewUserInfoModalDialogComponent, {
      data: {},
      scrollStrategy: this.overlay.scrollStrategies.noop(),
      width: '600px'
    });
    dialogRef.afterClosed().subscribe(result => {
      // TODO
    });
  }

  logOut() {
    this.userService.logOut()
      .subscribe(res => {
        this.router.navigate(['/pages/login']);
      });
  }
}

// 查看人群对话框
@Component({
  selector: 'app-view-user-info-modal-dialog',
  templateUrl: 'user-info-modal-dialog.html',
})
export class ViewUserInfoModalDialogComponent implements OnInit {

  user: any;

  sta: string;

  constructor(public dialogRef: MatDialogRef<ViewUserInfoModalDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private userService: UserService) {
  }

  ngOnInit() {
    this.user = this.userService.getUserInfo();
    if (this.user['state'] === 0) {
      this.sta = '正常';
    } else if (this.user['state'] === 1) {
      this.sta = '禁用';
    } else if (this.user['state'] === 2) {
      this.sta = '删除';
    } else {
      this.sta = '未审核';
    }
  }

  ok() {
    this.dialogRef.close(true);
  }
}
