import {Component, OnInit, ViewChild, Input, Output, EventEmitter} from '@angular/core';

import * as moment from 'moment';

declare const $: any;

// 日期插件，支持单选和范围选择
@Component({
  selector: 'app-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.scss']
})
export class DateRangePickerComponent implements OnInit {

  @ViewChild('dateRangePicker') dateRangePicker;

  @Input() singleDatePicker = true; // 是否单选,默认日期单选

  @Input() timePicker = false; // 是否支持时间选择，目前仅支持到分钟

  @Input() format = 'YYYY-MM-DD'; // 日期格式

  @Input() startDate: string; // 开始时间 格式必须与format相同
  @Input() endDate: string; // 结束时间 格式必须与format相同

  @Input() maxDate: string; // 最大日期 格式必须与format相同
  @Input() minDate: string; // 最小日期 格式必须与format相同

  @Input() date: any; // 选中的日期，可以用作双向绑定，例如<app-date-range-picker [(date)]="父组件的某个属性",实现这个功能需要提供dateChange
  @Output() dateChange: EventEmitter<any> = new EventEmitter<any>(); // 日期选择事件

  @Input() showRanges = false; // 是否显示日期范围快捷键

  @Input() disabled = false;


  constructor() {
  }

  ngOnInit() {
    const config = {
      singleDatePicker: this.singleDatePicker,
      timePicker: this.timePicker,
      timePicker24Hour: true,
      alwaysShowCalendars: true,
      locale: {
        format: this.format,
        applyLabel: '确定',
        cancelLabel: '取消',
        customRangeLabel: '自定义',
        daysOfWeek: [
          '日',
          '一',
          '二',
          '三',
          '四',
          '五',
          '六'
        ],
        'monthNames': [
          '一月',
          '二月',
          '三月',
          '四月',
          '五月',
          '六月',
          '七月',
          '八月',
          '九月',
          '十月',
          '十一月',
          '十二月'
        ],
      }
    };
    if (this.date) {
      this.startDate = this.date[0];
      this.endDate = this.date[1];
    }
    if (this.startDate) {
      config['startDate'] = this.startDate;
    }
    if (this.endDate) {
      config['endDate'] = this.endDate;
    }
    if (this.maxDate) {
      config['maxDate'] = this.maxDate;
    }
    if (this.minDate) {
      config['minDate'] = this.minDate;
    }
    if (this.showRanges) {
      config['ranges'] = {
        '今天': [moment(), moment()],
        '昨天': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        '最近7天': [moment().subtract(6, 'days'), moment()],
        '最近30天': [moment().subtract(29, 'days'), moment()],
        '本月': [moment().startOf('month'), moment().endOf('month')],
        '上月': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
      };
    }
    const that = this;
    $(this.dateRangePicker.nativeElement).daterangepicker(
      config, function (start, end, label) {
        if (that.singleDatePicker) {
          that.date = start.format(that.format);
          if (that.dateChange) {
            that.dateChange.emit(start.format(that.format));
          }
        } else {
          that.date = [start.format(that.format), end.format(that.format)];
          if (that.dateChange) {
            that.dateChange.emit(that.date);
          }
        }
      }
    );
  }

}
