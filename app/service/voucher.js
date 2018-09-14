'use strict';

module.exports = app => {
    class VoucherService extends app.Service {
        constructor(ctx) {
            super(ctx, app.model.Voucher, {
                associations: {
                    'shop': {model: app.model.Shop, as: 'shop'}, // alias
                    'examine_person': {model: app.model.User, as: 'examine_person'}, // alias
                    'operator': {model: app.model.User, as: 'operator'}, // alias
                    'activity': {model: app.model.Activity, as: 'activity'}, // alias
                },
                queries: {
                    id: false,
                    name: true,
                    enabled:false,
                    active_time:app.Service.TimeQuery,
                    active_start_time:app.Service.TimeQuery,
                    active_end_time:app.Service.TimeQuery,
                    examine_status:false,
                    shop_id:false,
                    is_active: function(attr, val, where){
                        where['$and'] =[app.Sequelize.where(app.Sequelize.col('activity.enabled'), '=', 1)]//   {'$like':'%' + val + '%' };
                    },
                },

            });
        }


    }

    return VoucherService;
};