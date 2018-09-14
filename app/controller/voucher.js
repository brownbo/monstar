/**
 * Created by 61972 on 2017/11/8.
 */
const main = require('./main');
module.exports = app => {
    class VoucherController extends app.Controller {
        constructor(ctx) {
            super(ctx, ctx.service.voucher);
        }
        async show(){
            const values = this.ctx.query;
            const id = this.ctx.params.id;
            if (values.stock) {
                const _stock = await main.judgeIsCanBuy(this, id);
                this.handleOptions();
                const voucher = await this.Service.findById(this.ctx.params[this.param], this.ctx.query);
                voucher.stock = _stock;
                return this.response('show', voucher);
            }else
            {
                return super.show();
            }
        }
        async create (){
            const values = this.ctx.request.body;
            if(values.voucher&&values.activity&&JSON.stringify(values.activity)!=='{}')
            {

                const user_id = this.ctx.cookies.get('user_id');
                if(!values.voucher.operator_id&&user_id)
                {
                    values.voucher.operator_id = user_id;
                }
                const activity = await this.service.activity.create(values.activity);
                return this.responseJSON(this.Service.create(Object.assign(values.voucher,{activity_id:activity.id})));
            }
            else if(values.voucher)
            {
                const user_id = this.ctx.cookies.get('user_id');
                if(!values.voucher.operator_id)
                {
                    values.voucher.operator_id = user_id;
                }
                return this.responseJSON(this.Service.create(values.voucher));
            }
            else
            {
                const user_id = this.ctx.cookies.get('user_id');
                if(!values.operator_id)
                {
                    values.operator_id = user_id;
                }
                return super.create(values);
            }
        }
        async update (){
            const values = this.ctx.request.body;
            const id = this.ctx.params.id;
            console.log(id);
            console.log(values);
            if(values.voucher&&values.activity&&JSON.stringify(values.activity)!=='{}')
            {
                console.log(!!values.activity);
                const user_id = this.ctx.cookies.get('user_id');
                if(!values.voucher.operator_id&&user_id)
                {
                    values.voucher.operator_id = user_id;
                }

                if(values.voucher.activity_id)
                {

                    await this.service.activity.update(values.voucher.activity_id,values.activity);
                    return this.responseJSON(this.Service.update(id,values.voucher));
                }
                else
                {

                    const _activity = await this.service.activity.create(values.activity);
                    values.voucher.activity_id = _activity.id;
                    return this.responseJSON(this.Service.update(id,values.voucher));
                }
            }
            else if(values.voucher)
            {
                const user_id = this.ctx.cookies.get('user_id');
                if(!values.voucher.operator_id)
                {
                    values.voucher.operator_id = user_id;
                }
                return this.responseJSON(this.Service.update(id,values.voucher));
            }
            else
            {
                const user_id = this.ctx.cookies.get('user_id');
                if(!values.operator_id)
                {
                    values.operator_id = user_id;
                }
                return super.update(values);
            }
        }
    }

    return VoucherController;
};