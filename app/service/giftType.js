'use strict';

module.exports = app => {
    class GiftTypeService extends app.Service {
        constructor(ctx) {
            super(ctx, app.model.GiftType, {
                associations: {
                    'operator': {model: app.model.User, as: 'operator'}, // alias
                },
                queries: {
                    id: false,
                    name: true,
                    enabled:false,
                },

            });
        }
    }

    return GiftTypeService;
};