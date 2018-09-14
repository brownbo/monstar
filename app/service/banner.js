'use strict';

module.exports = app => {
    class BannerService extends app.Service {
        constructor(ctx) {
            super(ctx, app.model.Banner, {
                associations: {
                    //'parent_area': {model: app.model.Banner, as: 'parent_area'}, // alias
                    'operator': {model: app.model.User, as: 'operator'}, // alias
                    'gift': {model: app.model.Gift, as: 'gift'}, // alias
                    'goods': {model: app.model.Goods, as: 'goods'}, // alias
                    'voucher': {model: app.model.Voucher, as: 'voucher'}, // alias
                    'shop': {model: app.model.Shop, as: 'shop'}, // alias
                    'business_recommend': {model: app.model.BusinessRecommend, as: 'business_recommend'},
                },
                queries: {
                    id: false,
                    name: true,
                    status:false,
                    type:false,
                },

            });
        }


    }

    return BannerService;
};