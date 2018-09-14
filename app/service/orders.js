'use strict';

module.exports = app => {
    class OrdersService extends app.Service {
        constructor(ctx) {
            super(ctx, app.model.Orders, {
                associations: {
                    'settle_table': {model: app.model.SettleTable, as: 'settle_table'}, // alias
                    'netspot': {model: app.model.Netspot, as: 'netspot'}, // alias
                    'shop': {model: app.model.Shop, as: 'shop'}, // alias
                    'goods': {model: app.model.Goods, as: 'goods'}, // alias
                    'gift': {model: app.model.Gift, as: 'gift'}, // alias
                    'voucher': {model: app.model.Voucher, as: 'voucher'}, // alias
                    'customer': {model: app.model.Customer, as: 'customer'}, // alias
                    'verify_merchant': {model: app.model.Merchant, as: 'verify_merchant'}, // alias
                    'verify_staff': {model: app.model.Staff, as: 'verify_staff'}, // alias
                    'operator': {model: app.model.User, as: 'operator'}, // alias
                },
                queries: {
                    id: false,
                    customer_name: true,
                    phone:true,
                    status:app.Service.statusQuery,
                    goods_id:false,
                    shop_id:false,
                    gift_id:false,
                    voucher_id:false,
                    type:false,
                    eval_id:false,
                    pay_type:false,
                    netspot_id:false,
                    customer_id:false,
                    order_no:true,
                    create_time:app.Service.TimeQuery,
                    pay_time:app.Service.TimeQuery,
                    verify_time:app.Service.TimeQuery,
                    sum_time:app.Service.TimeQuery,
                    sum_status:app.Service.statusQuery,
                    is_settlement:false,
                    verify_staff_id:false,
                    verify_merchant_id:false,
                    settle_table_id:false,
                },

            });
        }
        async showShopIndex(params,query){
            //const customer = await app.model.Customer.findById(params.id);
            console.log(params.id);
            console.log('冉俊峰积分比例:');
            console.log(params.score);
            if(params.sum_time||params.pay_time)
            {
                if(params.sum_time&&params.pay_time)
                {
                    const sums = await this.findAll(Object.assign(query,{shop_id:params.id,status:3,limit:100000,sum_status:3,sum_time:params.sum_time}));
                    let sum_price=0;
                    let total_points = 0;
                    sums.map(_order=>{
                        sum_price+=_order.amount;
                        total_points+= _order.total_points;
                    })

                    const wait_sums = await this.findAll(Object.assign(query,{shop_id:params.id,status:2,limit:100000,sum_status:1,sum_time:params.pay_time}));
                    let wait_sum_price=0;
                    wait_sums.map(_order=>{
                        total_points+= _order.total_points;
                        wait_sum_price+=_order.amount;
                    })

                    return {
                        _count:sums.length,
                        sum_price:parseFloat(sum_price)+parseFloat(wait_sum_price),
                        total_points:total_points,
                    }
                }
                else
                {
                    const sums = await this.findAll(Object.assign(query,{shop_id:params.id,status:3,limit:100000}));
                    let sum_price=0;
                    let total_points = 0;
                    sums.map(_order=>{
                        sum_price+=_order.amount;
                        total_points+= _order.total_points;
                    })
                    return {
                        _count:sums.length,
                        sum_price:sum_price,
                        total_points:total_points,
                    }
                }

            }
            else
            {
                const sums_today = await this.findAll({limit:100000,status:3,sum_status:3,shop_id:params.id,sum_time:new Date((new Date()).setHours(0, 0, 0, 0)).getTime()+','+new Date().getTime()});
                const sums_today_1 = await this.findAll({limit:100000,status:3,sum_status:2,shop_id:params.id,sum_time:new Date((new Date()).setHours(0, 0, 0, 0)).getTime()+','+new Date().getTime()});
                let sum_today_price=0;
                let sum_today_amount = 0;
                sums_today.map(_order=>{
                    sum_today_price+=_order.sum_price;
                    sum_today_amount+= _order.amount;
                 //   sum_today_points+= _order.total_points;
                });
                sums_today_1.map(_order=>{
                    sum_today_amount+= _order.amount;
                    //   sum_today_points+= _order.total_points;
                });
                console.log('今日结算积分为'+sum_today_price);
                sum_today_price = sum_today_price +sum_today_amount;
                console.log('今日结算总金额'+sum_today_price);
                const sums = await this.findAll({limit:100000,status:3,shop_id:params.id,sum_status:3});
                let sum_price=0;
                let sum_amount = 0
                sums.map(_order=>{
                    sum_price+=_order.sum_price;
                    sum_amount+= _order.amount;
                })
                console.log(sum_price);
                sum_price = sum_price +sum_amount;
                //统计未结算部分
                const wait_sum = await this.findAll({limit:100000,shop_id:params.id,status:2,sum_status:1}); //纯金额
                const wait_sum_2 = await this.findAll({limit:100000,shop_id:params.id,status:3,sum_status:'1,2'});// 纯积分
                let wait_sum_price=0;
                let wait_sum_amount=0;
                wait_sum_2.map(_order=>{
                    wait_sum_price+=_order.total_points;
                })
                wait_sum.map(_order=>{
                    wait_sum_amount+=_order.amount;
                })
                console.log((wait_sum_price/params.score)*100)
                wait_sum_price = (wait_sum_price/params.score)*100 +wait_sum_amount;
                console.log('未结算金额为'+wait_sum_price);
                //以上为统计未结算部分


                const pay_today = await this.findAll({limit:100000,status:'2,3',shop_id:params.id,verify_time:new Date((new Date()).setHours(0, 0, 0, 0)).getTime()+','+new Date().getTime()});
                const pay_count = pay_today.length;

                let pay_price=0;
                let pay_points=0;
                pay_today.map(_order=>{
                    pay_price+=_order.amount;
                    pay_points+=_order.total_points;
                });
              //  const merchantInfo = await app.model.Customer.findById(params.customerId);

                return {
                    sum_today_price: sum_today_price,
                    wait_sum_price: wait_sum_price,
                    sum_price: sum_price,
                    pay_count: pay_count,
                    pay_price: pay_price,
                    pay_points:pay_points,
                //    total_points:merchantInfo.total_points,
                //    exch_points:merchantInfo.exch_points,
                };
            }

        }
        async stat(params){
            const sums = await this.findAll(Object.assign(params,{limit:100000}));
            let sum_price=0;
            let sum_points=0
            sums.map(_order=>{
                sum_price+=~~_order.amount;
                sum_points+=~~_order.total_points;
            })

            const sums_vouchers = await this.findAll(Object.assign(params,{type:1,limit:100000}));
            const sums_gift = await this.findAll(Object.assign(params,{type:0,limit:1000000}));
            const sums_goods = await this.findAll(Object.assign(params,{type:2,limit:1000000}));
            return {
                _count:sums.length,
                sum_points:sum_points,
                sum_price:sum_price,
                voucher_count:sums_vouchers.length,
                gift_count:sums_gift.length,
                goods_count:sums_goods.length,
            }
        }
        async updateOrderByOrderNo(order_no,params){
            const order = await this.findOne({order_no:order_no});
            return this.update(order.id,params)
        }

        async findAll(opts,_opts={}) {
            if (opts.sum) {
                _opts.where = {'$and': []}
                // opts.include = [[app.Sequelize.fn('sum',app.Sequelize.col('project.state')),'total_score']];
                _opts.attributes = [[app.Sequelize.fn('sum', app.Sequelize.col('total_points')), 'total_points']];
                //  _opts.group = ['shop.id'];
                //_opts.where = {state: app.Sequelize.col('project.state')}
                _opts.where['$and'] = [
                    app.Sequelize.where(app.Sequelize.col('settle_table_id'), '=', null),
                ]
               // _opts.where['$or'] = [app.Sequelize.where(app.Sequelize.col('voucher.is_active'), '=', 1), app.Sequelize.where(app.Sequelize.col('goods.is_active'), '=', 1)];
            }else if(opts.n_sum)
            {
                _opts.where = {'$and': []}
                // opts.include = [[app.Sequelize.fn('sum',app.Sequelize.col('project.state')),'total_score']];
                //_opts.attributes = [[app.Sequelize.fn('sum', app.Sequelize.col('total_points')), 'total_points']];
                //  _opts.group = ['shop.id'];
                //_opts.where = {state: app.Sequelize.col('project.state')}
                _opts.where['$and'] = [
                    app.Sequelize.where(app.Sequelize.col('settle_table_id'), '=', null),
                ]
            }else if(opts.verify_goods)
            {
                _opts.where = {'$and': []}
                opts.include = ['goods'];
                _opts.attributes = [[app.Sequelize.col('goods.name'),'goods_name'],'goods_id'],
                // opts.include = [[app.Sequelize.fn('sum',app.Sequelize.col('project.state')),'total_score']];
                //_opts.attributes = [[app.Sequelize.fn('sum', app.Sequelize.col('total_points')), 'total_points']];
                _opts.group = ['goods.id'];
                //_opts.where = {state: app.Sequelize.col('project.state')}
                _opts.where['$and'] = [
                    app.Sequelize.where(app.Sequelize.col('settle_table_id'), '=', null),
                    app.Sequelize.where(app.Sequelize.col('status'), '=', 3),
                    app.Sequelize.where(app.Sequelize.col('type'), '=', 2),
                    app.Sequelize.where(app.Sequelize.col('total_points'), '>', 0),
                ]
            }else if(opts.verify_vouchers)
            {
                _opts.where = {'$and': []}
                opts.include = ['voucher'];
                _opts.attributes = [[app.Sequelize.col('voucher.name'),'voucher_name'],'voucher_id'],
                    // opts.include = [[app.Sequelize.fn('sum',app.Sequelize.col('project.state')),'total_score']];
                    //_opts.attributes = [[app.Sequelize.fn('sum', app.Sequelize.col('total_points')), 'total_points']];
                    _opts.group = ['voucher.id'];
                //_opts.where = {state: app.Sequelize.col('project.state')}
                _opts.where['$and'] = [
                    app.Sequelize.where(app.Sequelize.col('settle_table_id'), '=', null),
                    app.Sequelize.where(app.Sequelize.col('status'), '=', 3),
                    app.Sequelize.where(app.Sequelize.col('type'), '=', 1),
                ]
            }else if(opts.un_settle_shop){
                _opts.where = {'$and': []}
                opts.include = ['shop'];
                _opts.attributes = [[app.Sequelize.col('shop.name'),'shop_name'],'shop_id','pay_time','total_points'],
                    // opts.include = [[app.Sequelize.fn('sum',app.Sequelize.col('project.state')),'total_score']];
                    //_opts.attributes = [[app.Sequelize.fn('sum', app.Sequelize.col('total_points')), 'total_points']];
                    _opts.group = ['shop.id'];
                //_opts.where = {state: app.Sequelize.col('project.state')}
                _opts.where['$and'] = [
                    app.Sequelize.where(app.Sequelize.col('settle_table_id'), '=', null),
                    app.Sequelize.where(app.Sequelize.col('shop_id'), '>', 0),
                ]
            }else if(opts.un_settle_netspot){
                _opts.where = {'$and': []}
                opts.include = ['netspot'];
                _opts.attributes = [[app.Sequelize.col('netspot.name'),'netspot_name'],'netspot_id','pay_time','total_points'],
                    // opts.include = [[app.Sequelize.fn('sum',app.Sequelize.col('project.state')),'total_score']];
                    //_opts.attributes = [[app.Sequelize.fn('sum', app.Sequelize.col('total_points')), 'total_points']];
                    _opts.group = ['netspot.id'];
                //_opts.where = {state: app.Sequelize.col('project.state')}
                _opts.where['$and'] = [
                    app.Sequelize.where(app.Sequelize.col('settle_table_id'), '=', null),
                    app.Sequelize.where(app.Sequelize.col('netspot_id'), '>', 0),
                ]
            }else if(opts.show_all_settle)
            {
                   // console.log()
                    const le_pay_time = (opts.all_pay_time).split(',')[0];
                    const ge_pay_time = (opts.all_pay_time).split(',')[1];
                    const le_sum_time = (opts.all_pay_time).split(',')[0];
                    const ge_sum_time = (opts.all_pay_time).split(',')[1];
                    _opts.where = { '$or' : {} }
                    // opts.include = [ 'voucher','goods'];
                    //  _opts.attributes = ['shop.id','goods.id','vouchers.id','shop.name','vouchers.exch_Points','goods.exch_Points'];
                    _opts.where['$or'] = [
                        {
                            '$and': [
                                app.Sequelize.where(app.Sequelize.col('pay_time'), '>', new Date(parseInt(le_pay_time))),
                                app.Sequelize.where(app.Sequelize.col('pay_time'), '<', new Date(parseInt(ge_pay_time))),
                                app.Sequelize.where(app.Sequelize.col('status'), '=', 3),
                                app.Sequelize.where(app.Sequelize.col('sum_status'), '=', 1),
                            ]
                        },
                        {
                            '$and': [
                                app.Sequelize.where(app.Sequelize.col('sum_time'), '>',new Date(parseInt(le_sum_time))),
                                app.Sequelize.where(app.Sequelize.col('sum_time'), '<', new Date(parseInt(ge_sum_time))),
                                app.Sequelize.where(app.Sequelize.col('status'), '=', 3),
                                app.Sequelize.where(app.Sequelize.col('sum_status'), '=', 3),
                            ]
                        },
                        // app.Sequelize.where(app.Sequelize.col('goods->activity.exch_points'), '<=', ~~opts.mypoints),
                ]
            }

            if(opts.pay_orders)
            {
                _opts.where = {'$and': []}
                _opts.where['$and'] = [
                    app.Sequelize.where(app.Sequelize.col('amount'), '>', 0),
                ]
            }

            return super.findAll(opts,_opts);
        }
    }

    return OrdersService;
};