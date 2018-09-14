'use strict';

module.exports = app => {
    class SettleTableService extends app.Service {
        constructor(ctx) {
            super(ctx, app.model.SettleTable, {
                associations: {
                    'shop': {model: app.model.Shop, as: 'shop'}, // alias
                    'orders': {model: app.model.Orders, as: 'orders'}, // alias
                },
                queries: {
                    id:false,
                    shop_id: false,
                    created_at:app.Service.TimeQuery,
                    shop_name:true,
                },

            });
        }
        async findAll(opts,_opts={}){

                // opts.include = [ 'voucher','goods'];
                //  _opts.attributes = ['shop.id','goods.id','vouchers.id','shop.name','vouchers.exch_Points','goods.exch_Points'];
           /* _opts.include = [{
                model: app.model.Orders,
                as:'orders',
                include: [{model: app.model.Goods, required: false}]
            }];*/

            return super.findAll(opts,_opts);
        }


    }

    return SettleTableService;
};