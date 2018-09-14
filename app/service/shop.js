/**
 * Created by 61972 on 2017/11/8.
 */
'use strict';
module.exports = app => {
    class ShopService extends app.Service {
        constructor(ctx) {
            super(ctx, app.model.Shop, {
                associations: {
                    'recommend': {model: app.model.BusinessRecommend, as: 'recommend'},
                    'recommend1': {model: app.model.Goods, as: 'recommend1'},
                    'recommend2': {model: app.model.Voucher, as: 'recommend2'},
                    'shop_type': {model: app.model.ShopType, as: 'shop_type'},
                  //  'merchant': {model: app.model.Merchant, as: 'merchant'},
                    'apply_person': {model: app.model.User, as: 'apply_person'},
                    'operator': {model: app.model.User, as: 'operator'},
                    'examine_person': {model: app.model.User, as: 'examine_person'},
                    'vouchers': {model: app.model.Voucher, as: 'vouchers'},
                    'goods': {model: app.model.Goods, as: 'goods'},
                    'voucher': {model: app.model.Voucher, as: 'voucher'},
                },
                queries: {
                    id: false,
                    name: true,
                    shop_type_id:false,
                    username:true,
                    merId:false,
                    sign_status:false,
                    status:false,
                    account_name:true,
                    apply_person_id:false,
                    connect_person:true,
                    connect_phone:true,
                    address:true,
                    is_recommend:false,
                    merchant_id:false,
                    geo_code:true,
                    examine_status:app.Service.statusQuery,
                    is_settlement:false,
                    settlement_cycle:false,
                },


            });
        }
        handleOptions(opts, _opts) {
            if (!!opts._group) {
                _opts.group = opts._group.split(",");
            }
            return super.handleOptions(opts, _opts);
        }
        findAll(opts, _opts={}){

            if(opts.availableShops&&opts.mypoints) {
                _opts.where = { '$or' : {} }
               // opts.include = [ 'voucher','goods'];
              //  _opts.attributes = ['shop.id','goods.id','vouchers.id','shop.name','vouchers.exch_Points','goods.exch_Points'];
                _opts.include = [{
                    model: app.model.Voucher,
                    as:'voucher',
                    include: [{model: app.model.Activity, required: false}]
                }, {
                    model: app.model.Goods,
                    as:'goods',
                    include: [{model: app.model.Activity, required: false}]
                }];
                _opts.group = ['shop.id'];
                _opts.where['$or'] = [
                    {
                        '$and': [
                            app.Sequelize.where(app.Sequelize.col('voucher->activity.exch_points'), '<=', ~~opts.mypoints),
                            app.Sequelize.where(app.Sequelize.col('voucher->activity.enabled'), '=', 1)
                        ]
                    },
                    {
                        '$and': [
                            app.Sequelize.where(app.Sequelize.col('goods->activity.exch_points'), '<=', ~~opts.mypoints),
                            app.Sequelize.where(app.Sequelize.col('goods->activity.enabled'), '=', 1)
                        ]
                    },
                    // app.Sequelize.where(app.Sequelize.col('goods->activity.exch_points'), '<=', ~~opts.mypoints),
                    app.Sequelize.where(app.Sequelize.col('goods.exch_points'), '<=', ~~opts.mypoints),
                    app.Sequelize.where(app.Sequelize.col('voucher.exch_points'), '<=', ~~opts.mypoints)];
            }
            else if(opts.is_active)
            {
                _opts.where = { '$or' : {} }
                opts.include = [ 'voucher','goods'];
                //  _opts.attributes = ['shop.id','goods.id','vouchers.id','shop.name','vouchers.exch_Points','goods.exch_Points'];
                _opts.group = ['shop.id'];
                //_opts.where= { state: app.Sequelize.col('project.state') }
                //  _opts.where=
                _opts.where['$or'] = [app.Sequelize.where(app.Sequelize.col('voucher.is_active'), '=', 1),app.Sequelize.where(app.Sequelize.col('goods.is_active'), '=', 1)];
            }
            else if(opts.geo_code_array)
            {
                _opts.where = { '$or' : {} }
                //  _opts.attributes = ['shop.id','goods.id','vouchers.id','shop.name','vouchers.exch_Points','goods.exch_Points'];
                _opts.group = ['shop.id'];
                //_opts.where= { state: app.Sequelize.col('project.state') }
                //  _opts.where=
                _opts.where['$or'] = [
                    app.Sequelize.where(app.Sequelize.col('geo_code'), 'like', '%' +opts.geo_code_array[0] + '%'),
                    app.Sequelize.where(app.Sequelize.col('geo_code'), 'like', '%' +opts.geo_code_array[1] + '%'),
                    app.Sequelize.where(app.Sequelize.col('geo_code'), 'like', '%' +opts.geo_code_array[2] + '%'),
                    app.Sequelize.where(app.Sequelize.col('geo_code'), 'like', '%' +opts.geo_code_array[3] + '%'),
                    app.Sequelize.where(app.Sequelize.col('geo_code'), 'like', '%' +opts.geo_code_array[4] + '%'),
                    app.Sequelize.where(app.Sequelize.col('geo_code'), 'like', '%' +opts.geo_code_array[5] + '%'),
                    app.Sequelize.where(app.Sequelize.col('geo_code'), 'like', '%' +opts.geo_code_array[6] + '%'),
                    app.Sequelize.where(app.Sequelize.col('geo_code'), 'like', '%' +opts.geo_code_array[7] + '%'),
                    app.Sequelize.where(app.Sequelize.col('geo_code'), 'like', '%' +opts.geo_code_array[8] + '%'),
                ];

            }
           /* else if(opts.lat&&opts.long&&opts.distance)
            {
                const range = 180 / (Math.PI * parseFloat(opts.distance)) / 6372.797;     //里面的 1 就代表搜索 1km 之内，单位km
                console.log(range)
                const Lrange = range / Math.cos(opts.lat * Math.PI / 180);
                console.log(Lrange)
                _opts.where = { '$and' : {} }
                //opts.include = [ 'voucher','goods'];
                //  _opts.attributes = ['shop.id','goods.id','vouchers.id','shop.name','vouchers.exch_Points','goods.exch_Points'];
                _opts.group = ['shop.id'];
                _opts.attributes = ['name',
                    [
                        app.Sequelize.fn('sqrt',
                            (
                                app.Sequelize.fn('power', (parseFloat(opts.lat) - app.Sequelize.col('lat')), 2)
                                + app.Sequelize.fn('power', (parseFloat(opts.long) - app.Sequelize.col('long')), 2)
                            ))
                        , 'distance']];
                //_opts.where= { state: app.Sequelize.col('project.state') }
                //  _opts.where=
                _opts.where['$and'] = [
                    app.Sequelize.where(app.Sequelize.col('lat'), '>=', parseFloat(parseFloat(opts.lat)-parseFloat(range))),
                    app.Sequelize.where(app.Sequelize.col('lat'), '<=', parseFloat(parseFloat(opts.lat)+parseFloat(range))),
                    app.Sequelize.where(app.Sequelize.col('long'), '>=', parseFloat(parseFloat(opts.long)-parseFloat(Lrange))),
                    app.Sequelize.where(app.Sequelize.col('long'), '<=', parseFloat(parseFloat(opts.long)+parseFloat(Lrange))),
                ];
                _opts.order =[
                    ['distance', 'DESC'],
                ];
            }*/

            return super.findAll(opts,_opts);
        }
    }

    return ShopService;
};