'use strict';

module.exports = app => {
    class EvalService extends app.Service {
        constructor(ctx) {
            super(ctx, app.model.EvaluateGift, {
                associations: {
                    'gift': {model: app.model.Gift, as: 'gift'}, // alias
                    'eval_customer': {model: app.model.Customer, as: 'eval_customer'}, // alias
                    'reply_user': {model: app.model.User, as: 'reply_user'}, // alias
                    'parent_eval': {model: app.model.EvaluateGift, as: 'parent_eval'}, // alias
                    'operator': {model: app.model.User, as: 'operator'}, // alias

                },
                queries: {
                    id: false,
                    name: true,
                    gift_id:false,
                    eval_customer_id:false,
                    reply_user_id:false,
                    is_first_eval:false,
                    eval_time:app.Service.TimeQuery,
                    reply_time:app.Service.TimeQuery,
                    parent_eval_id:false,
                },

            });
        }


    }

    return EvalService;
};