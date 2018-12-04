import {Injectable} from '@angular/core';

declare const $: any;

// 全局通知栏服务
@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    constructor() {
    }

    // 通知栏
    // type支持'default', 'info', 'success', 'warning', 'danger', 'rose', 'primary' ,默认'primary'
    // form支持top  bottom,默认bottom
    // align支持left right,默认right
    // timer 默认3000，表示3秒
    showNotification(message: string, title = '', timer = 3000, type = 'primary', from = 'bottom', align = 'right') {
        $.notify({
            icon: 'notifications',
            title: title,
            message: message
        }, {
            type: type,
            delay: timer,
            timer: 1000,
            z_index: 1051,
            mouse_over: 'pause',
            placement: {
                from: from,
                align: align
            },
            template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0} alert-with-icon" role="alert">' +
            '<button mat-raised-button type="button" aria-hidden="true" class="close" data-notify="dismiss">  ' +
            '<i class="material-icons">close</i></button>' +
            '<i class="material-icons" data-notify="icon">notifications</i> ' +
            '<span data-notify="title">{1}</span> ' +
            '<span data-notify="message">{2}</span>' +
            '<div class="progress" data-notify="progressbar">' +
            '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" ' +
            'style="width: 0%;"></div>' +
            '</div>' +
            '</div>'
        });
    }
}
