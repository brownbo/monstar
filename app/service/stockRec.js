'use strict';

module.exports = app => {
    class StockRecService extends app.Service {
        constructor(ctx) {
            super(ctx, app.model.StockRec, {
                associations: {
                    'examine': {model: app.model.Examine, as: 'examine'}, // alias
                    'gift': {model: app.model.Gift, as: 'gift'}, // alias
                    'allocation_in': {model: app.model.Netspot, as: 'allocation_in'}, // alias
                    'allocation_out': {model: app.model.Netspot, as: 'allocation_out'}, // alias
                    'operator': {model: app.model.User, as: 'operator'}, // alias

        },
                queries: {
                    id: false,
                    name: true,
                    allocation_in_id:false,
                    allocation_out_id:false,
                    gift_id:false,
                    examine_id:false,
                    status:app.Service.statusQuery,
                    sign_time:app.Service.TimeQuery,

                },

            });
        }


    }

    return StockRecService;
};