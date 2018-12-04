import {Component, OnDestroy, OnInit} from '@angular/core';
import {Validators, FormGroup, FormBuilder, FormArray, FormControl} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {NotificationService} from '../../util/notification/notification.service';
import {DeviceSegmentInfoService} from '../device-segment-info.service';
import {WebSiteService} from '../../web-site.service';
import {ProbeService} from '../../probe/probe/probe.service';
import * as _ from 'underscore';
import * as moment from 'moment';
import {Subscription} from 'rxjs/Rx';
import {forkJoin} from 'rxjs/index';

declare const $: any;

@Component({
  selector: 'app-new-device-segment-info',
  templateUrl: './new-device-segment-info.component.html',
  styleUrls: ['./new-device-segment-info.component.scss']
})
export class NewDeviceSegmentInfoComponent implements OnInit, OnDestroy {

  subscription: Subscription;

  formType: FormGroup;

  probes: any[]; // 可选探针集合

  visitorTypes = [ // 访客类型
    {
      name: '所有访客',
      value: -1
    },
    {
      name: '老访客',
      value: 0
    },
    {
      name: '新访客',
      value: 1
    }
  ];
  activities = [{ // 用户活跃度
    name: '高活跃',
    value: '3'
  },
    {
      name: '中活跃',
      value: '2'
    },
    {
      name: '低活跃',
      value: '1'
    },
    {
      name: '沉睡',
      value: '0'
    }
  ];

  selectedDate: any[]; // 选中的日期范围

  oses = [{name: 'IOS', value: 0}, {name: '安卓', value: 1}]; // 可选操作系统

  phoneBrands = [ // 可选手机品牌
    {name: '苹果', value: '苹果', type: 0},
    {name: '华为', value: '华为', type: 1},
    {name: '三星', value: '三星', type: 1},
    {name: 'OPPO', value: 'OPPO', type: 1},
    {name: 'VIVO', value: 'VIVO', type: 1},
    {name: '小米', value: '小米', type: 1},
    {name: '魅族', value: '魅族', type: 1},
    {name: '索尼', value: '索尼', type: 1}
  ];

  allTags: any[]; // 所有标签
  filtedTags: any[]; // 过滤后的标签

  agentId: number;

  $validator: any;

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private notificationService: NotificationService,
              private deviceSegmentInfoService: DeviceSegmentInfoService,
              private router: Router,
              private webSiteService: WebSiteService,
              private probeService: ProbeService) {
    this.subscription = this.webSiteService.getMessage().subscribe(site => { // 所选网站变化事件，所有跟site相关的数据都应该在这里执行
      // 初始化数据
      this.initData();
    });
    this.selectedDate = [moment().format('YYYY-MM-DD') + ' 00:00:00', moment().format('YYYY-MM-DD HH:mm:ss')];
  }

  initData() {
    const post1 = this.probeService.listAll(this.webSiteService.getCurrentSelectedSite().value);
    const post2 = this.probeService.listHistory(this.webSiteService.getCurrentSelectedSite().value);
    const post3 = this.deviceSegmentInfoService.queryTags();
    const post4 = this.deviceSegmentInfoService.queryAgentId();
    forkJoin([post1, post2, post3, post4])
      .subscribe(res => {
        this.probes = res[0].rows;
        this.probes = res[1].rows.reduce(function (p, c) {
          const even = _.find(p, function (probe) {
            return probe['mac'] === c.mac;
          });
          if (!even) {
            c.history = true;
            p = p.concat(c);
          }
          return p;
        }, this.probes);
        this.allTags = res[2].rows;
        this.agentId = res[3].obj;
        if (this.agentId !== 265) {
          this.filtedTags = this.allTags.filter(x => x['dtype'] !== 'game' && x['dtype'] !== 'app');
        } else {
          this.filtedTags = this.allTags
        }
        this.formType.reset();
        this.formType = this.formBuilder.group({
          name: [null, Validators.required],
          selectedProbes: this.formBuilder.array(this.probes.map(x => false)),
          selectedVisitorType: [-1],
          selectedActivity: this.formBuilder.array(this.activities.map(x => false)),
          distance: [100, Validators.max(100)],
          selectedOs: this.formBuilder.array(this.oses.map(x => false)),
          selectedBrand: this.formBuilder.array(this.phoneBrands.map(x => false)),
          selectedStayDuration: [0],
          minStayDuration: [null],
          maxStayDuration: [null],
          description: [''],
          selectedTags: new FormArray([])
        });
      });
  }

  onNext(event: any) {
    const $valid = $('.card-wizard form').valid();
    if (!$valid) {
      this.$validator.focusInvalid();
      return event[1]['cancel'] = true;
    }
    const minStayDuration = this.formType.get('minStayDuration').value;
    const maxStayDuration = this.formType.get('maxStayDuration').value;
    if (typeof minStayDuration === 'number' && typeof maxStayDuration === 'number' && maxStayDuration <= minStayDuration) {
      this.notificationService.showNotification('停留时长上限必须大于下限', '', 1500, 'danger');
      return event[1]['cancel'] = true;
    }

    if (!this.formType.get('selectedProbes').value.reduce(function (a, b) {
        return a || b;
      })) {
      this.notificationService.showNotification('必须至少选择一个探针', '', 1500, 'danger');
      return event[1]['cancel'] = true;
    }
    event[1]['cancel'] = false;
  }

  ngOnInit() {
    this.route.data.subscribe((res: { resolveData: any[] }) => {
      this.probes = res.resolveData[0].rows;
      this.probes = res.resolveData[1].rows.reduce(function (p, c) {
        const even = _.find(p, function (probe) {
          return probe['mac'] === c.mac;
        });
        if (!even) {
          c.history = true;
          p = p.concat(c);
        }
        return p;
      }, this.probes);
      this.allTags = res.resolveData[2].rows;
      this.agentId = res.resolveData[3].obj;
      if (this.agentId !== 265) {
        this.filtedTags = this.allTags.filter(x => x['dtype'] !== 'game' && x['dtype'] !== 'app');
      } else {
        this.filtedTags = this.allTags
      }
    });

    this.formType = this.formBuilder.group({
      name: [null, Validators.required],
      selectedProbes: this.formBuilder.array(this.probes.map(x => false)),
      selectedVisitorType: [-1],
      selectedActivity: this.formBuilder.array(this.activities.map(x => false)),
      distance: [100, Validators.max(100)],
      selectedOs: this.formBuilder.array(this.oses.map(x => false)),
      selectedBrand: this.formBuilder.array(this.phoneBrands.map(x => false)),
      selectedStayDuration: [0],
      minStayDuration: [null],
      maxStayDuration: [null],
      description: [''],
      selectedTags: new FormArray([])
    });
    // Code for the Validator
    this.$validator = $('.card-wizard form').validate({
      rules: {
        name: {
          required: true,
          minlength: 3
        },
        distance: {
          max: 100
        },
        minStayDuration: {
          min: 0
        },
        maxStayDuration: {
          max: 1440
        }
      },

      highlight: function (element) {
        $(element).closest('.form-group').removeClass('has-success').addClass('has-danger');
      },
      success: function (element) {
        $(element).closest('.form-group').removeClass('has-danger').addClass('has-success');
      },
      errorPlacement: function (error, element) {
        $(element).append(error);
      }
    });
  }

  brandShow(i: number): boolean {
    if (this.formType.get('selectedOs').value.reduce(function (a, b) {
        return a === b;
      })) {
      return true;
    }

    for (let j = 0; j < this.formType.get('selectedOs').value.length; j++) {
      if (this.phoneBrands[i].type === this.oses[j].value && this.formType.get('selectedOs').value[j]) {
        return true;
      }
    }
    return false;
  }

  filteTags(tags: any []) {
    const that = this;
    return tags.filter(function (item) {
      if (that.agentId !== 265) {
        return (item.name.indexOf('性别') > -1 || item.name.indexOf('年龄') > -1)
      } else {
        return item;
      }
    });
  };

  stopPropagation(event) { // 防止点击事件冒泡
    event.stopPropagation();
  }

  onTagCheckChange(event) {
    const formArray: FormArray = this.formType.get('selectedTags') as FormArray;

    if (event.checked) {
      formArray.push(new FormControl(event.source.value));
    } else {
      let i = 0;

      formArray.controls.forEach((ctrl: FormControl) => {
        if (ctrl.value === event.source.value) {
          // Remove the unselected element from the arrayForm
          formArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  childrenChecked(tag: any) {
    const values = this.formType.get('selectedTags').value;
    for (let i = 0; i < tag.children.length; i++) {
      if ($.inArray(tag.children[i].id, values) !== -1) {
        return true;
      }
    }
    return false;
  }

  addSegment() { // 新建人群
    const segment = {siteId: this.webSiteService.getCurrentSelectedSite().value, status: 0};
    if (this.formType.get('distance').value > 0) {// 探测距离
      segment['probeDistance'] = this.formType.get('distance').value;
    }
    if (this.formType.get('selectedStayDuration').value === 1) {// 停留时长
      if (this.formType.get('minStayDuration').value >= 0) {
        segment['minStayDuration'] = this.formType.get('minStayDuration').value;
      }
      if (this.formType.get('maxStayDuration').value > 0) {
        segment['maxStayDuration'] = this.formType.get('maxStayDuration').value;
      }
    }

    let hasSelectOs = false; // 操作系统
    for (let i = 0; i < this.formType.get('selectedOs').value.length; i++) {
      if (this.formType.get('selectedOs').value[i]) {
        hasSelectOs = true;
      }
    }
    if (hasSelectOs) {
      if (this.formType.get('selectedOs').value[0] && !this.formType.get('selectedOs').value[1]) {
        segment['os'] = 'idfa';
      } else if (!this.formType.get('selectedOs').value[0] && this.formType.get('selectedOs').value[1]) {
        segment['os'] = 'imei';
      } else if (this.formType.get('selectedOs').value[0] && this.formType.get('selectedOs').value[1]) {
        segment['os'] = '';
      }
    }

    const brands = []; // 品牌
    for (let i = 0; i < this.formType.get('selectedBrand').value.length; i++) {
      if (this.formType.get('selectedBrand').value[i]) {
        brands.push(this.phoneBrands[i]['value']);
      }
    }
    if (brands.length > 0) {
      segment['phoneBrand'] = brands.join(',');
    }

    // 开始和结束时间
    segment['beginTime'] = this.selectedDate[0];
    segment['endTime'] = this.selectedDate[1];

    // 探针
    const probes = [];
    for (let i = 0; i < this.formType.get('selectedProbes').value.length; i++) {
      if (this.formType.get('selectedProbes').value[i]) {
        probes.push(this.probes[i]['mac']);
      }
    }
    segment['probes'] = probes.join('|');

    // 标签
    const tags = [];
    for (let i = 0; i < this.formType.get('selectedTags').value.length; i++) {
      tags.push(this.formType.get('selectedTags').value[i]);
    }
    segment['tags'] = tags.join('|');

    const activity = []; // 访客活跃度
    if (this.formType.get('selectedVisitorType').value === 0) {
      for (let i = 0; i < this.formType.get('selectedActivity').value.length; i++) {
        if (this.formType.get('selectedActivity').value[i]) {
          activity.push(this.activities[i].value);
        }
      }
    }
    segment['activity'] = activity.join('|');
    segment['visitorType'] = this.formType.get('selectedVisitorType').value;

    segment['description'] = this.formType.get('description').value;
    segment['name'] = this.formType.get('name').value;
    this.deviceSegmentInfoService.insert(segment)
      .subscribe(res => {
        if (res.success) {
          this.notificationService.showNotification('新建人群成功', '', 1500, 'success');
          this.router.navigate(['/devicesegmentinfo']);
        } else {
          this.notificationService.showNotification(res.msg, '', 1500, 'danger');
        }
      });
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }
}

