import {Component, OnInit, Input, ViewChild, ViewContainerRef} from '@angular/core';

declare const $: any;

@Component({
    selector: 'app-full-screen',
    templateUrl: './full-screen.component.html',
    styleUrls: ['./full-screen.component.scss']
})
export class FullScreenComponent implements OnInit {

    icon = 'fullscreen';

    @Input() fullScreened = false;

    @ViewChild('fullScreenBtn') fullScreenBtn;

    constructor(private viewContainer: ViewContainerRef) {
        this.viewContainer.element.nativeElement.style.position = 'absolute';
        this.viewContainer.element.nativeElement.style.top = '0';
        this.viewContainer.element.nativeElement.style.right = '0';
        this.viewContainer.element.nativeElement.style.zIndex = 1;
    }

    ngOnInit() {
    }

    changeScreen() {
        const parentELe = $(this.fullScreenBtn.nativeElement).parent().parent();

        this.fullScreened = !this.fullScreened;
        if (this.fullScreened) {
            parentELe.addClass('full-screen');
            this.icon = 'fullscreen_exit';
        } else {
            parentELe.removeClass('full-screen');
            this.icon = 'fullscreen';
        }
    }

}
