/**
 * Created by 61972 on 2017/11/8.
 */
module.exports = app => {
    class StockRecController extends app.Controller {
        constructor(ctx) {
            super(ctx, ctx.service.stockRec);
        }
       /* async update (){
            const values = this.ctx.request.body;
            const user_id = this.ctx.cookies.get('user_id');
            if(!values.operator_id)
            {
                values.operator_id = user_id;
            }
            return super.update(values);
        }*/
        async update() {
            // 签收、部分签收、拒绝签收
            const { sign_count, status, sign_time } = this.ctx.request.body;
            if (status > 0 && status < 3) {
                // 找到记录
                const record = await this.Service.findById(this.ctx.params.id
                    , {
                        include: ["gift"],
                        plain: false
                    });
                // 找到 stock
                let stock = await this.service.stock.findOne({
                    netspot_id: record.allocation_in_id,
                    gift_id: record.gift_id,
                    plain: false
                });
                if (!stock) {
                    stock = app.model.Stock.build({
                        gift_id: record.gift_id,
                        stock: sign_count,
                        gift_type_id: record.gift.gift_type_id,
                        netspot_id: record.allocation_in_id,
                        price: record.gift.amount
                    });
                } else {
                    stock.stock = app.Sequelize.literal('`stock`+' + sign_count);
                }
                const promise = app.model.transaction(function(t) {
                    return stock
                        .save({ transaction: t })
                        .then(stock => {
                            return record.update(
                                {
                                    sign_count,
                                    status,
                                    sign_time
                                },
                                { transaction: t }
                            );
                        });
                });
                return this.response("update", promise);
            } else {
                return super.update();
            }
        }
        async create(){
            const values = this.ctx.request.body;
            const user_id = this.ctx.cookies.get('user_id');
            if(!values.operator_id)
            {
                values.operator_id = user_id;
            }
            const _count = values.allocation_count;

            if(values.allocation_out_id)
            {
                if(!values.autoRefund)
                {
                    const net_out = await this.service.stock.findOne({plain:false,netspot_id:values.allocation_out_id,gift_id:values.gift_id});
                    await net_out.decrement({stock:_count})
                }
            }
            else
            {
                const net_in = await this.service.stock.findOne({plain:false,netspot_id:values.allocation_in_id,gift_id:values.gift_id});
                if(net_in)
                {
                    await net_in.increment({stock:_count})
                }
                else
                {
                    const _gift = await this.service.gift.findById(values.gift_id);
                    const _params = {
                        gift_id: values.gift_id,
                        stock:_count,
                        gift_type_id:_gift.gift_type_id,
                        netspot_id:values.allocation_in_id,
                        price:_gift.amount,
                    }
                    await this.service.stock.create(_params)
                }
            }
            return super.create(values);
        }
    }

    return StockRecController;
};