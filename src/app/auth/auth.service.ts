import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import {UserService} from './user.service';

@Injectable()
export class AuthService {

    isLoggedIn = false;

    // store the URL so we can redirect after logging in
    redirectUrl: string;

    constructor(private http: HttpClient, private userService: UserService) {
        this.login();
    }

    login(): Observable<any> {
        return this.http.post<any>('options/checkUserLogin.action', '', {});
            // .subscribe(
            // user => {
            //     if (!user) {
            //         this.isLoggedIn = false;
            //     } else {
            //         this.userService.setUserInfo(user);
            //         this.isLoggedIn = true;
            //     }
            // }
    }

    logout(): void {
        this.isLoggedIn = false;
    }
}
