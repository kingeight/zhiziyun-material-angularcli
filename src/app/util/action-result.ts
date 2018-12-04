// 后台接口一般操作返回数据结构
export class ActionResult {
    constructor(public msg: string, public obj: any, public success: boolean) {
    }
}

