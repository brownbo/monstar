'use strict';

module.exports = app => {
    class EvalGoodsService extends app.Service {
        constructor(ctx) {
            super(ctx, app.model.EvaluateGoods, {
                associations: {
                    //'parent_area': {model: app.model.Banner, as: 'parent_area'}, // alias
                    'goods': {model: app.model.Goods, as: 'goods'}, // alias
                    'eval_customer': {model: app.model.Customer, as: 'eval_customer'}, // alias
                    'reply_user': {model: app.model.User, as: 'reply_user'}, // alias
                    'operator': {model: app.model.User, as: 'operator'}, // alias
                    'parent_eval': {model: app.model.EvaluateGoods, as: 'parent_eval'}, // alias
                },
                queries: {
                    id: false,
                    name: true,
                    goods_id:false,
                    eval_customer_id:false,
                    reply_user_id:false,
                    eval_time:app.Service.TimeQuery,
                    reply_time:app.Service.TimeQuery,
                    is_first_eval:false,
                    parent_eval_id:false,
                },

            });
        }


    }

    return EvalGoodsService;
};