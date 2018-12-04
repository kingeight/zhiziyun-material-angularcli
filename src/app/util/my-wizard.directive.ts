import {Directive, ElementRef, Output, EventEmitter, AfterViewInit, Input} from '@angular/core';

declare const $: any;

// 生成向导指令

@Directive({
  selector: '[appMyWizard]'
})
export class MyWizardDirective implements AfterViewInit {

  @Output() next = new EventEmitter(); // 下一步

  @Output() init = new EventEmitter(); // 初始化

  @Output() tabClick = new EventEmitter(); // 点击tab

  @Output() tabShow = new EventEmitter(); // 显示tab

  @Input() canTabClick = false; // 是否支持直接点击tab页转换向导，因为有验证的问题，所以默认禁止了

  navigation: any;

  constructor(private el: ElementRef) {
  }


  ngAfterViewInit() {
    const that = this;
    this.navigation = $(this.el.nativeElement).bootstrapWizard({
      'tabClass': 'nav nav-pills',
      'nextSelector': '.btn-next',
      'previousSelector': '.btn-previous',
      onNext: function (tab, navigation, index) {
        that.next.emit([tab, navigation, index]); // 如果要阻止进入到下一步，需要在navigation上设置属性cancel，值为true
        if (navigation['cancel']) {
          return false;
        }
      },

      onInit: function (tab: any, navigation: any, index: any) {
        // check number of tabs and fill the entire row
        let $total = navigation.find('li').length;
        const $wizard = navigation.closest('.card-wizard');

        const $first_li = navigation.find('li:first-child a').html();
        const $moving_div = $('<div class="moving-tab">' + $first_li + '</div>');
        $('.card-wizard .wizard-navigation').append($moving_div);

        $total = $wizard.find('.nav li').length;
        let $li_width = 100 / $total;

        const total_steps = $wizard.find('.nav li').length;
        let move_distance = $wizard.width() / total_steps;
        let index_temp = index;
        let vertical_level = 0;

        const mobile_device = $(document).width() < 600 && $total > 3;

        if (mobile_device) {
          move_distance = $wizard.width() / 2;
          index_temp = index % 2;
          $li_width = 50;
        }

        $wizard.find('.nav li').css('width', $li_width + '%');

        const step_width = move_distance;
        move_distance = move_distance * index_temp;

        const $current = index + 1;

        if ($current === 1 || (mobile_device === true && (index % 2 === 0))) {
          move_distance -= 8;
        } else if ($current === total_steps || (mobile_device === true && (index % 2 === 1))) {
          move_distance += 8;
        }

        if (mobile_device) {
          const x: any = index / 2;
          vertical_level = parseInt(x, 0);
          vertical_level = vertical_level * 38;
        }

        $wizard.find('.moving-tab').css('width', step_width);
        $('.moving-tab').css({
          'transform': 'translate3d(' + move_distance + 'px, ' + vertical_level + 'px, 0)',
          'transition': 'all 0.5s cubic-bezier(0.29, 1.42, 0.79, 1)'

        });
        $('.moving-tab').css('transition', 'transform 0s');
        that.init.emit([tab, navigation, index]);
      },
      onTabClick: function (tab: any, navigation: any, index: any) {
        if (!that.canTabClick) {
          return false;
        } else {
          that.tabClick.emit([tab, navigation, index]);
          const $valid = $('.card-wizard form').valid();

          if (!$valid) {
            return false;
          } else {
            return true;
          }
        }
      },
      onTabShow: function (tab: any, navigation: any, index: any) {
        that.tabShow.emit([tab, navigation, index]);
        let $total = navigation.find('li').length;
        let $current = index + 1;

        const $wizard = navigation.closest('.card-wizard');

        // If it's the last tab then hide the last button and show the finish instead
        if ($current >= $total) {
          $($wizard).find('.btn-next').hide();
          $($wizard).find('.btn-finish').show();
        } else {
          $($wizard).find('.btn-next').show();
          $($wizard).find('.btn-finish').hide();
        }

        const button_text = navigation.find('li:nth-child(' + $current + ') a').html();

        setTimeout(function () {
          $('.moving-tab').text(button_text);
        }, 150);

        const checkbox = $('.footer-checkbox');

        if (index !== 0) {
          $(checkbox).css({
            'opacity': '0',
            'visibility': 'hidden',
            'position': 'absolute'
          });
        } else {
          $(checkbox).css({
            'opacity': '1',
            'visibility': 'visible'
          });
        }
        $total = $wizard.find('.nav li').length;
        let $li_width = 100 / $total;

        const total_steps = $wizard.find('.nav li').length;
        let move_distance = $wizard.width() / total_steps;
        let index_temp = index;
        let vertical_level = 0;

        const mobile_device = $(document).width() < 600 && $total > 3;

        if (mobile_device) {
          move_distance = $wizard.width() / 2;
          index_temp = index % 2;
          $li_width = 50;
        }

        $wizard.find('.nav li').css('width', $li_width + '%');

        const step_width = move_distance;
        move_distance = move_distance * index_temp;

        $current = index + 1;

        if ($current === 1 || (mobile_device === true && (index % 2 === 0))) {
          move_distance -= 8;
        } else if ($current === total_steps || (mobile_device === true && (index % 2 === 1))) {
          move_distance += 8;
        }

        if (mobile_device) {
          const x: any = index / 2;
          vertical_level = parseInt(x, 0);
          vertical_level = vertical_level * 38;
        }

        $wizard.find('.moving-tab').css('width', step_width);
        $('.moving-tab').css({
          'transform': 'translate3d(' + move_distance + 'px, ' + vertical_level + 'px, 0)',
          'transition': 'all 0.5s cubic-bezier(0.29, 1.42, 0.79, 1)'
        });
      }
    });
  }

}
