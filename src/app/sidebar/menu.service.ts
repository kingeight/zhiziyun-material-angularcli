import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Observable} from 'rxjs/Rx';

export class Menu {
    constructor(public children: Menu[], public url: string, public name: string) {
    }
}

@Injectable({
    providedIn: 'root'
})
export class MenuService {

    constructor(private http: HttpClient) {
    }

    fetchMenu(): Observable<Menu[]> {
        return this.http.post<Menu[]>('proxy/loginuser/rootMenus.action', '', {});
    }
}
