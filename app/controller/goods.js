/**
 * Created by 61972 on 2017/11/8.
 */
const main = require('./main');
module.exports = app => {
    class GoodsController extends app.Controller {
        constructor(ctx) {
            super(ctx, ctx.service.goods);
        }
        async create (){
            const values = this.ctx.request.body;
            if(values.goods&&values.activity&&JSON.stringify(values.activity)!=='{}')
            {

                const user_id = this.ctx.cookies.get('user_id');
                if(!values.goods.operator_id&&user_id)
                {
                    values.goods.operator_id = user_id;
                }
                const activity = await this.service.activity.create(values.activity);
                return this.responseJSON(this.Service.create(Object.assign(values.goods,{activity_id:activity.id})));
            }
            else if(values.goods)
            {
                const user_id = this.ctx.cookies.get('user_id');
                if(!values.goods.operator_id)
                {
                    values.goods.operator_id = user_id;
                }
                return this.responseJSON(this.Service.create(values.goods));
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
            if(values.goods&&values.activity&&JSON.stringify(values.activity)!=='{}')
            {
                console.log(!!values.activity);
                const user_id = this.ctx.cookies.get('user_id');
                if(!values.goods.operator_id&&user_id)
                {
                    values.goods.operator_id = user_id;
                }

                if(values.goods.activity_id)
                {

                    await this.service.activity.update(values.goods.activity_id,values.activity);
                    return this.responseJSON(this.Service.update(id,values.goods));
                }
                else
                {

                    const _activity = await this.service.activity.create(values.activity);
                    values.goods.activity_id = _activity.id;
                    return this.responseJSON(this.Service.update(id,values.goods));
                }
            }
            else if(values.goods)
            {
                const user_id = this.ctx.cookies.get('user_id');
                if(!values.goods.operator_id)
                {
                    values.goods.operator_id = user_id;
                }
                return this.responseJSON(this.Service.update(id,values.goods));
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
        async show(){
            const values = this.ctx.query;
            const id = this.ctx.params.id;
            if (values.stock) {
                const _stock = await main.judgeIsCanBuy(this, id);
                this.handleOptions();
                const goods = await this.Service.findById(this.ctx.params[this.param], this.ctx.query);
                goods.stock = _stock;
                return this.response('show', goods);
            }else
            {
                return super.show();
            }
        }
        async list(){
            const values = this.ctx.query;
            console.log(values);
            if(values.convertible)
            {
                const exch_points = this.ctx.query.exch_points;
                const str = 'abc,ab,abc,as,ab';
                const list  = this.responseJSON(this.Service.findAll({DISTINCT:true,attributes:[app.Sequelize.fn('DISTINCT',app.Sequelize.col('shop_id'),'shopId')]}))
                //const list =this.responseJSON( this.Service.findCon(values));
                return list;
            }
            else
            {
                return super.list(values);
            }

        }

    }

    return GoodsController;
};