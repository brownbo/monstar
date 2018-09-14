//'use strict';
const xlsx = require('node-xlsx');
module.exports = app => {
    class EvalGoodsController extends app.Controller {
        constructor(ctx) {
            super(ctx, ctx.service.evaluateGoods);
        }
        async update (){
            const values = this.ctx.request.body;
            const user_id = this.ctx.cookies.get('user_id');
            if(!values.operator_id)
            {
                values.operator_id = user_id;
            }
            return super.update(values);
        }
        async exportExcel() {
            const data = await this.Service.findAll(Object.assign(this.ctx.query,{include:true}));
            const _data = data.map(item => [
                item.goods && item.goods.name || '无数据', // 接车操作员
                item.goods && item.goods.brand || '无数据', // 入库员
                item.eval_customer && item.eval_customer.name || '无数据', // 取车操作员
                item.eval_time && item.eval_time || '无数据', // 出库员
                item.eval_content && item.eval_content || '无数据', // 出库员
                item.reply_user && item.reply_user.username || '无数据', // 接车时间
                item.reply_time && item.reply_time || '无数据', // 取车时间
                item.reply_content && item.reply_content || '无数据', // 出库员
            ]);
            // 加上字段名
            _data.unshift(['商品名称', '商品品牌', '评价人', '评价时间','评价内容', '回复人',
                '回复时间','回复内容'
            ]);
            this.ctx.attachment('report.xls');
            this.ctx.body = xlsx.build([{name: 'report', data: _data}]);
        }
        async create(){
            const values = this.ctx.request.body;
            console.log(values);
            const user_id = this.ctx.cookies.get('user_id');
            if(!values.operator_id)
            {
                values.operator_id = user_id;
            }
            const _eval = await this.Service.create(values);
            const order_id = values.order_id;
            if(order_id)
            {
                this.service.orders.update(order_id,{eval_id:_eval.id})
            }

            this.ctx.body={success:true,data:_eval};
        }
    }
    return EvalGoodsController;
};