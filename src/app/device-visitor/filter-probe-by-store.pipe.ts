import {Pipe, PipeTransform} from '@angular/core';

// 基于门店过滤探针的管道
@Pipe({
  name: 'filterProbeByStore'
})
export class FilterProbeByStorePipe implements PipeTransform {

  transform(value: any, filter: any): any {
    if (!filter) {
      return value;
    }
    return value.filter(item => {
      return item['storeId'] === filter || typeof item['storeId'] === 'undefined';
    });
  }

}
