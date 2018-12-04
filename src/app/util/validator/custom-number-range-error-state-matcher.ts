import {ErrorStateMatcher} from '@angular/material/core';
import {FormControl, FormGroupDirective, NgForm} from '@angular/forms';

// 取值范围验证，默认最小值为0，最大无穷
export class CustomNumberRangeErrorStateMatcher implements ErrorStateMatcher {

    min: number;
    max: number | null;

    constructor(min = 0, max = null) {
        this.min = min;
        this.max = max;
    }

    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        let isInRange = true;
        if (typeof this.min !== 'number' && typeof this.max !== 'number') {
            return control.invalid && (control.dirty || control.touched || isSubmitted);
        }
        if (typeof this.min === 'number') {
            if (control.value < this.min) {
                isInRange = false;
            }
        }
        if (typeof this.max === 'number') {
            if (control.value > this.max) {
                isInRange = false;
            }
        }
        if (!isInRange) {
            // 设置form的状态为非法以便可以使用form的状态禁用提交按扭
            control.setErrors({'incorrect': true});
        }
        return ((control.dirty || control.touched || isSubmitted) && !isInRange);
    }
}
