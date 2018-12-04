import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/index';
import {Subject} from 'rxjs/Rx';

@Injectable({
  providedIn: 'root'
})
export class WebSiteService {

  private currentSite: any;
  private subject = new Subject<any>();
  private sites: any[];

  constructor(private http: HttpClient) {
  }

  getCurrentSite(): Observable<any> {
    return this.http.post<any>('/options/getCurrentSite.action', '', {});
  }

  getCurrentSelectedSite() {
    return this.currentSite;
  }

  setSite(site: any, sendMessage: boolean = true) {
    if (this.currentSite) {
      this.http.post('/options/addCurrentSite.action?siteId=' + site.value, '', {}).subscribe(); // 将选中的网站添加到redis
    }
    this.currentSite = site;
    if (sendMessage) {
      this.sendMessage();
    }
  }

  sendMessage() { // 当site改变的是否发射消息
    this.subject.next(this.currentSite);
  }

  clearMessage() {
    this.subject.next();
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }

  getSite(): Observable<any> {
    return of(this.currentSite);
  }

  setSites(sites: any[]) {
    this.sites = sites;
  }

  getSites(): any {
    return this.sites;
  }
}
