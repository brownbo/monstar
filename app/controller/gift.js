//'use strict';
const main = require('./main');
module.exports = app => {
    class GiftController extends app.Controller {
        constructor(ctx) {
            super(ctx, ctx.service.gift);
        }
        async show(){
            const values = this.ctx.query;
            const id = this.ctx.params.id;
            if (values.stock) {
                const _stock = await main.judgeGiftIsCanBuy(this, id);
                this.handleOptions();
                const gift = await this.Service.findById(this.ctx.params[this.param], this.ctx.query);
                gift.stock = _stock;
                return this.response('show', gift);
            }else
            {
                return super.show();
            }
        }
        async create (){
            const values = this.ctx.request.body;
            if(values.gift&&values.activity&&JSON.stringify(values.activity)!=='{}')
            {

                const user_id = this.ctx.cookies.get('user_id');
                if(!values.gift.operator_id&&user_id)
                {
                    values.gift.operator_id = user_id;
                }
                const activity = await this.service.activity.create(values.activity);
                return this.responseJSON(this.Service.create(Object.assign(values.gift,{activity_id:activity.id})));
            }
            else if(values.gift)
            {
                const user_id = this.ctx.cookies.get('user_id');
                if(!values.gift.operator_id)
                {
                    values.gift.operator_id = user_id;
                }
                return this.responseJSON(this.Service.create(values.gift));
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
            if(values.gift&&values.activity&&JSON.stringify(values.activity)!=='{}')
            {
                console.log(!!values.activity);
                const user_id = this.ctx.cookies.get('user_id');
                if(!values.gift.operator_id&&user_id)
                {
                    values.gift.operator_id = user_id;
                }

                if(values.gift.activity_id)
                {

                    await this.service.activity.update(values.gift.activity_id,values.activity);
                    return this.responseJSON(this.Service.update(id,values.gift));
                }
                else
                {

                    const _activity = await this.service.activity.create(values.activity);
                    values.gift.activity_id = _activity.id;
                    return this.responseJSON(this.Service.update(id,values.gift));
                }
            }
            else if(values.gift)
            {
                const user_id = this.ctx.cookies.get('user_id');
                if(!values.gift.operator_id)
                {
                    values.gift.operator_id = user_id;
                }
                return this.responseJSON(this.Service.update(id,values.gift));
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

    return GiftController;
};