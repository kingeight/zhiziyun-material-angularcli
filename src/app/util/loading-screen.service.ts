import {Inject, Injectable} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {animate, AnimationBuilder, AnimationPlayer, style} from '@angular/animations';
import {NavigationStart, NavigationEnd, Router, NavigationCancel} from '@angular/router';

// 网络加载的时候出现loading并锁屏阻止用户进行其他操作
@Injectable({
    providedIn: 'root'
})
export class LoadingScreenService {

    private loadingScreenEl: HTMLElement = null;
    private player: AnimationPlayer;

    private isEnabled = false;
    private isShowing = false;
    private isHiding = false;
    private counter = 0; // 计数器，当同时出现多个请求时，只有当最后一个请求返回才解除锁屏状态

    constructor(private animationBuilder: AnimationBuilder,
                @Inject(DOCUMENT) private document: any = null,
                private router: Router = null) {
        if (document !== null) {
            this.loadingScreenEl = this.document.body.querySelector('#fuse-loading-screen');
        }

        if (router !== null) {
            this.router.events.subscribe((event) => {
                    if (event instanceof NavigationStart) {
                        setTimeout(() => {
                            this.show();
                        }, 0);
                    }
                    if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
                        setTimeout(() => {
                            this.hide();
                        }, 0);
                    }
                }
            );
        }
    }

    /**
     * @param {number} wait Duration (ms) of a timeout before showing the spinner
     */
    show(wait: number = 1000) {
        this.counter++;
        if (this.isEnabled || this.isShowing) {
            return;
        }

        this.isShowing = true;
        this.player =
            this.animationBuilder
                .build([
                    style({
                        opacity: '0',
                        zIndex: '9999'
                    }),
                    animate('500ms ease', style({opacity: '1'}))
                ]).create(this.loadingScreenEl);

        this.isEnabled = true;

        setTimeout(() => {
            this.player.play();

            setTimeout(() => {
                this.isShowing = false;
            }, 200);
        }, wait);

    }

    hide() {
        this.counter--;
        if (this.counter > 0) {
            return;
        }

        if (this.counter < 0) {
            this.counter = 0;
        }
        if (!this.isShowing
            && (!this.isEnabled || this.isHiding)) {
            return;
        }

        this.isHiding = true;
        this.player =
            this.animationBuilder
                .build([
                    style({opacity: '1'}),
                    animate('50ms ease', style({
                        opacity: '0',
                        zIndex: '-20'
                    }))
                ]).create(this.loadingScreenEl);

        setTimeout(() => {
            this.isEnabled = false;
            this.player.play();

            setTimeout(() => {
                this.isHiding = false;
            }, 50);
        }, 0);
    }
}
