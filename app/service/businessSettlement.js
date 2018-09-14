'use strict';

module.exports = app => {
    class BusinessSettlementService extends app.Service {
        constructor(ctx) {
            super(ctx, app.model.BusinessSettlement, {
                associations: {
                    'shop': {model: app.model.Shop, as: 'shop'}, // alias
                    'operator': {model: app.model.User, as: 'operator'}, // alias
                },
                queries: {
                    id: false,
                    name: true,
                    shop_id:false,
                },

            });
        }



    }

    return BusinessSettlementService;
};