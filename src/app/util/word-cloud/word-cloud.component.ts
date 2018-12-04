import {Component, OnInit, ViewChild, Input, OnChanges, SimpleChange} from '@angular/core';
import * as d3 from 'd3';
import * as moment from 'moment';

declare const WordCloud: any;
declare const $: any;

// 标签云，words格式[{name;'somewords',weight:12},{name:'somewords1',weight:10}]
@Component({
  selector: 'app-word-cloud',
  templateUrl: './word-cloud.component.html',
  styleUrls: ['./word-cloud.component.scss']
})
export class WordCloudComponent implements OnInit, OnChanges {

  @Input() words: any[];

  @ViewChild('wordCloudWrap') wordCloudWrap;

  constructor() {
  }

  ngOnInit() {
    this.render();
  }

  render() {
    console.log(moment().date());
    const linear = d3.scale.linear() // 生成线性比例尺
      .domain([0, 100])         // 设置定义域
      .range([1, 8]);
    if (this.words && this.words.length > 0) {
      const list = [];
      for (let i = 0; i < this.words.length; i++) {
        const tmp = [];
        tmp.push(this.words[i]['name']);
        const weight = linear(this.words[i]['weight']);
        tmp.push(weight);
        list.push(tmp);
      }
      WordCloud(this.wordCloudWrap.nativeElement, {
        list: list,
        gridSize: 2,
        fontFamily: 'Roboto,"Helvetica Neue",sans-serif',
        weightFactor: 16,
        color: 'random-dark',
        backgroundColor: 'transparent',
        rotateRatio: 0,
        minSize: 8,
        drawOutOfBound: true
      });
    }
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    for (const propName in changes) {
      if (propName === 'words') {
        const changedProp = changes[propName];
        if (changedProp.previousValue) {
          $(this.wordCloudWrap.nativeElement).html('');
          this.render();
        }
        break;
      }
    }
  }

}
