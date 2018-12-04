import {ErrorStateMatcher} from '@angular/material/core';
import {FormControl, FormGroupDirective, NgForm} from '@angular/forms';

// 表单验证类，验证某个表单的值是否与另外一个值相等,注意，目标元素的必须满足模板表达式#someId="ngModel",target传值someid
export class CustomConfirmErrorStateMatcher implements ErrorStateMatcher {

    target: string;

    constructor(target: string) {
        this.target = target;
    }


    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        let isEquals = true;
        if (form.form.controls[this.target] && form.form.controls[this.target].value === control.value) {
            isEquals = true;
        } else {
            isEquals = false;
        }
        if (!isEquals) {
            // 设置form的状态为非法以便可以使用form的状态禁用提交按扭
            control.setErrors({'incorrect': true});
        }
        return ((control.dirty || control.touched || isSubmitted) && !isEquals);
    }
}
