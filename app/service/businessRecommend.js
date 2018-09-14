'use strict';

module.exports = app => {
    class BusinessService extends app.Service {
        constructor(ctx) {
            super(ctx, app.model.BusinessRecommend, {
                associations: {
                    //'parent_area': {model: app.model.Banner, as: 'parent_area'}, // alias
                    'operator': {model: app.model.User, as: 'operator'}, // alias
                },
                queries: {
                    id: false,
                    name: true,
                    is_hot:false,
                },

            });
        }


    }

    return BusinessService;
};