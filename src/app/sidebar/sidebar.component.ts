import {Component, OnInit} from '@angular/core';
import PerfectScrollbar from 'perfect-scrollbar';

import {tap} from 'rxjs/internal/operators';

import {MenuService, Menu} from './menu.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Rx';
import {WebSiteService} from '../web-site.service';
import {UserService} from '../auth/user.service';
import {Router} from '@angular/router';

declare const $: any;

// Metadata
export interface RouteInfo {
  path: string;
  title: string;
  type: string;
  icontype: string;
  collapse?: string;
  children?: ChildrenItems[];
}

export interface ChildrenItems {
  path: string;
  title: string;
  ab: string;
  type?: string;
}

// Menu Items
export const ROUTES: RouteInfo[] = [{
  path: '/dashboard',
  title: '首页',
  type: 'link',
  icontype: 'dashboard'
}, {
  path: '/store',
  title: '门店管理',
  type: 'sub',
  icontype: 'apps',
  children: [
    {path: '\/store\/\\d+', title: '探针管理 ', ab: ''}
  ]
},
  {
    path: '/devicevisit',
    title: '到店访客列表',
    type: 'link',
    icontype: 'apps'
  },
  {
    path: '/deVisitAllReport',
    title: '客流趋势分析',
    type: 'link',
    icontype: 'apps'
  },
  {
    path: '/deVisitType',
    title: '新老顾客分析',
    type: 'link',
    icontype: 'apps'
  },
  {
    path: '/deVisitTimeLength',
    title: '驻店时长分析',
    type: 'link',
    icontype: 'apps'
  },
  {
    path: '/deBasicAttr',
    title: '属性分析',
    type: 'link',
    icontype: 'apps'
  },
  {
    path: '/devicesegmentinfo',
    title: '到店人群管理',
    type: 'sub',
    icontype: 'apps',
    children: [
      {
        path: '/newdevicesegmentinfo',
        title: '新建到店人群',
        ab: ''
      },
      {
        path: '\/viewdevicesegmentinfo\/\\d+',
        title: '查看到店人群',
        ab: ''
      }
    ]
  },
  {
    path: '/adClickSegmentInfo',
    title: '广告人群管理',
    type: 'link',
    icontype: 'apps'
  },
  {
    path: '/wifiSegmentInfo',
    title: 'WiFi人群管理',
    type: 'link',
    icontype: 'apps'
  }
  , {
    path: '/forms',
    title: 'Forms',
    type: 'sub',
    icontype: 'content_paste',
    collapse: 'forms',
    children: [
      {path: 'regular', title: 'Regular Forms', ab: 'RF'},
      {path: 'extended', title: 'Extended Forms', ab: 'EF'},
      {path: 'validation', title: 'Validation Forms', ab: 'VF'},
      {path: 'wizard', title: 'Wizard', ab: 'W'}
    ]
  }, {
    path: '/tables',
    title: 'Tables',
    type: 'sub',
    icontype: 'grid_on',
    collapse: 'tables',
    children: [
      {path: 'regular', title: 'Regular Tables', ab: 'RT'},
      {path: 'extended', title: 'Extended Tables', ab: 'ET'},
      {path: 'datatables.net', title: 'Datatables.net', ab: 'DT'}
    ]
  }, {
    path: '/maps',
    title: 'Maps',
    type: 'sub',
    icontype: 'place',
    collapse: 'maps',
    children: [
      {path: 'google', title: 'Google Maps', ab: 'GM'},
      {path: 'fullscreen', title: 'Full Screen Map', ab: 'FSM'},
      {path: 'vector', title: 'Vector Map', ab: 'VM'}
    ]
  }, {
    path: '/widgets',
    title: 'Widgets',
    type: 'link',
    icontype: 'widgets'

  }, {
    path: '/charts',
    title: 'Charts',
    type: 'link',
    icontype: 'timeline'

  }, {
    path: '/calendar',
    title: 'Calendar',
    type: 'link',
    icontype: 'date_range'
  }, {
    path: '/pages',
    title: 'Pages',
    type: 'sub',
    icontype: 'image',
    collapse: 'pages',
    children: [
      {path: 'pricing', title: 'Pricing', ab: 'P'},
      {path: 'timeline', title: 'Timeline Page', ab: 'TP'},
      {path: 'login', title: 'Login Page', ab: 'LP'},
      {path: 'register', title: 'Register Page', ab: 'RP'},
      {path: 'lock', title: 'Lock Screen Page', ab: 'LSP'},
      {path: 'user', title: 'User Page', ab: 'UP'}
    ]
  }
];

const IconTypes = ['dashboard', 'apps', 'content_paste', 'grid_on', 'place', 'widgets', 'timeline', 'date_range', 'image'];

@Component({
  selector: 'app-sidebar-cmp',
  templateUrl: 'sidebar.component.html'
})

export class SidebarComponent implements OnInit {
  public menuItems: any[];

  public menus: Menu[];

  searchText = '';
  searchSites: any[];

  constructor(private menuService: MenuService,
              private http: HttpClient,
              private webSiteService: WebSiteService,
              private userService: UserService,
              private router: Router) {
    this.searchSites = [this.webSiteService.getCurrentSelectedSite()];
  }

  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  };

  ngOnInit() {
    this.menuItems = [];
    this.getMenus();
  }

  updatePS(): void {
    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
      const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');
      const ps = new PerfectScrollbar(elemSidebar, {wheelSpeed: 2, suppressScrollX: true});
    }
  }

  isMac(): boolean {
    let bool = false;
    if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
      bool = true;
    }
    return bool;
  }

  getMenus() {
    this.menuService.fetchMenu().subscribe(data => {
      this.menus = data;
      this.menus.unshift({'name': '首页', 'url': '/dashboard', 'children': []});
      this.menuItems = this.generateMenu(this.menus);
    });
  }

  generateMenu(menu: Menu[]): any[] {
    const result: any[] = [];
    for (let i = 0; i < menu.length; i++) {
      const obj = {};
      obj['path'] = menu[i].url;
      obj['title'] = menu[i].name;
      obj['icontype'] = IconTypes[i];
      if (menu[i].children === null || menu[i].children.length === 0) {
        obj['type'] = 'link';
        obj['ab'] = menu[i].name.substr(0, 1);
      } else {
        obj['type'] = 'sub';
        obj['collapse'] = Math.random() + '';
        obj['children'] = this.generateMenu(menu[i].children);
      }
      result.push(obj);
    }
    return result;
  }

  searchSite() {
    this.http.post<any[]>('/options/searchSiteOption.action', {'searchCode': this.searchText}, {})
      .subscribe(res => {
        this.searchSites = res;
      });
  }

  choseSite(site: any) {
    this.webSiteService.setSite(site);
  }

  siteSelected(site: any) {
    return this.webSiteService.getCurrentSelectedSite().value === site.value;
  }

  logOut() {
    this.userService.logOut()
      .subscribe(res => {
        this.router.navigate(['/pages/login']);
      });
  }

}
