'use strict';

module.exports = app => {
    class StockService extends app.Service {
        constructor(ctx) {
            super(ctx, app.model.Stock, {
                associations: {
                    'gift': {model: app.model.Gift, as: 'gift'}, // alias
                    'gift_type': {model: app.model.GiftType, as: 'gift_type'}, // alias
                    'operator': {model: app.model.User, as: 'operator'}, // alias
                    'netspot': {model: app.model.Netspot, as: 'netspot'}, // alias
                },
                queries: {
                    id: false,
                    name: true,
					status: false,
                    gift_id:false,
                    gift_name: function(attr, val, where){
                        where['$and'] =[app.Sequelize.where(app.Sequelize.col('gift.name'), 'like', '%' + val + '%')]//   {'$like':'%' + val + '%' };
                    },
                    stock:app.Service.pointsQuery,
                    gift_type_id:false,
                    netspot_id:false,
					count_warning: function(attr, val, where){
						where.stock = {
							'$lte': app.Sequelize.col('gift_type.count_warning')
						}
					}
                },


            });
        }
        findAll(opts, _opts={}){

            if(opts.availableGfit) {
              //  _opts.where = { '$or' : {} }
               // opts.include = [ 'voucher','goods'];
                //  _opts.attributes = ['shop.id','goods.id','vouchers.id','shop.name','vouchers.exch_Points','goods.exch_Points'];
                _opts.group = ['gift_id'];
                //_opts.where= { state: app.Sequelize.col('project.state') }
                //  _opts.where=
                _opts.where = app.Sequelize.where(app.Sequelize.col('stock'), '>', 0);
            }
            return super.findAll(opts,_opts);
        }

    }

    return StockService;
};