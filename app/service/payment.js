'use strict';
const querystring = {
    stringify: function (obj) {
        let str = '';
        for (let key in obj) {
            str += '&' + key + '=' + obj[key]
        }
        return str.slice(1);
    }
}
module.exports = app => {
    class PaymentService extends app._Service {

        async checkSignature(model, body){
            console.log('校验签名中...')

            return this.ctx.curl(app.config.bankAPI.signature, {
                // 必须指定 method
                method: 'POST',
                data: {
                    merId: app.config.shopCode,
                    model: model,
                    respString: body
                },
                // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
                dataType: 'json',
            });
        }

        async payOrRefund(opts){
            console.log('收到后台通知', opts);
            // 支付成功
            if (~~opts.transType === 1 && ~~opts.respCode === 0 && ~~opts.payStatus === 2) {
                // 校验签名
                const is_check = await this.checkSignature('01', querystring.stringify(opts));
                if(is_check.message==='success'&& is_check.result.toString() === 'true')
                {
                    const _order = await this.service.orders.findById(opts.orderNumber);
                    const status = _order.get('status');
                    if (status !== 0 && status !== 1) {
                        return {success:false,message:('原订单 ' + _order.id + ' 状态为: ' + status + ', 支付通知被忽略')};
                    }
                    await this.service.orders.update(opts.orderNumber,{status:2});
                    return {success:true,message:'更新成功!'}
                }
                else
                {
                    return {success:false,message:is_check.message}
                }
            }
            // 退货
            else if (~~opts.transType === 2) {
                // 校验签名

                const is_check = await this.checkSignature('02', querystring.stringify(opts));
                if(is_check.message==='success'&& is_check.result.toString() === 'true')
                {
                    const _order = await this.service.orders.findById(opts.oriOrderNumber);
                    const status = _order.get('status');
                    if (status === -1 || status === -4) {
                        await this.service.orders.update(opts.orderNumber,{status:-3});
                        return {success:true,message:'退货成功!'}
                    }
                    return {success:false,message:'原订单 ' + _order.id + ' 状态为: ' + status + ', 退货通知被忽略'}
                }
                else
                {
                    return {success:false,message:is_check.message}
                }

            }
        }
    }

    return PaymentService;
};