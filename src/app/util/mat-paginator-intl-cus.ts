import {MatPaginatorIntl} from '@angular/material';

// 自定义翻页组件文字
export class MatPaginatorIntlCus extends MatPaginatorIntl {
    itemsPerPageLabel = '每页显示数';
    nextPageLabel     = '下一页';
    previousPageLabel = '上一页';
    firstPageLabel = '首页';
    lastPageLabel = '末页';

    getRangeLabel = function (page, pageSize, length) {
        if (length === 0 || pageSize === 0) {
            return '0 od ' + length;
        }
        length = Math.max(length, 0);
        const startIndex = page * pageSize;
        // If the start index exceeds the list length, do not try and fix the end index to the end.
        const endIndex = startIndex < length ?
            Math.min(startIndex + pageSize, length) :
            startIndex + pageSize;
        return '显示' + (startIndex + 1) + ' 到 ' + endIndex + '项/共' + length + '项';
    };

}