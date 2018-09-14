/**
 * Created by 61972 on 2017/11/8.
 */
'use strict';

module.exports = app => {
    class GoodsService extends app.Service {
        constructor(ctx) {
            super(ctx, app.model.Goods, {
                associations: {
                    'commit_person': {model: app.model.Customer, as: 'commit_person'}, // alias
                    'shop': {model: app.model.Shop, as: 'shop'},
                    'examine_person': {model: app.model.User, as: 'examine_person'},
                    'operator': {model: app.model.User, as: 'operator'}, // alias
                   // 'sales': {model: app.model.Sales, as: 'sales'},
                    'activity': {model: app.model.Activity, as: 'activity'}, // alias
                },
                queries: {
                    id: false,
                    name: true,
                    sum_count:false,
                    price:false,
                    shop_id:true,
                    phone:true,
                    account:false,
                    is_active: function(attr, val, where){
                        where['$and'] =[app.Sequelize.where(app.Sequelize.col('activity.enabled'), '=', 1)]//   {'$like':'%' + val + '%' };
                    },
               //     status:false,
                    examine_status:false,
                    apply_price:false,
                    exch_points:app.Service.pointsQuery,
                    commit_time:app.Service.TimeQuery,
                    is_recommend:false,
                    enabled:false,
                },
                async findCon(params){
                    const goods = await this.findAll(Object.assign(params,{distinct:true,include:['shop'],exch_points:params.exch_points+',100000'}));
                    return goods;
                },

            });
        }
    }

    return GoodsService;
};