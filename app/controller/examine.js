//'use strict';

module.exports = app => {
    class ExamineController extends app.Controller {
        constructor(ctx) {
            super(ctx, ctx.service.examine);
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
        async create (){
            const values = this.ctx.request.body;
            const user_id = this.ctx.cookies.get('user_id');
           /* const increase_or_reduce = ~~values.increase_or_reduce;
            const netspot_id = values.netspot_id;
            const gift_id =values.gift_id;
            if(increase_or_reduce&&increase_or_reduce===1)  //加法
            {
                const _stock = await this.service.stock.findOne({netspot_id:netspot_id,gift_id:gift_id});
                const _count = _stock.stock + ~~values._count;
                await this.service.stock.update(_stock.id,{stock:_count});
            }
            else if(increase_or_reduce&&increase_or_reduce===2)  //减法
            {
                const _stock = await this.service.stock.findOne({netspot_id:netspot_id,gift_id:gift_id});
                const _count = _stock.stock - ~~values._count;
                await this.service.stock.update(_stock.id,{stock:_count});
            }*/

            if(!values.operator_id)
            {
                values.operator_id = user_id;
            }
            if(!values.application_time)
            {
                values.application_time = new Date();
            }
            return super.create(values);
        }
    }

    return ExamineController;
};