'use strict';

module.exports = app => {
    class GiftSignService extends app.Service {
        constructor(ctx) {
            super(ctx, app.model.GiftSign, {
                associations: {
                    'gift': {model: app.model.Gift, as: 'gift'}, // alias
                    'netspot': {model: app.model.Netspot, as: 'netspot'}, // alias
                    'examine': {model: app.model.Examine, as: 'examine'}, // alias
                    'sign_people': {model: app.model.Staff, as: 'sign_people'}, // alias
                    'operator': {model: app.model.User, as: 'operator'}, // alias
                },
                queries: {
                    gift_id: false,
                    status:false,
                    netspot_id:false,
                    sign_people_id:false,
                    sign_time:app.Service.TimeQuery,

                },

            });
        }
    }

    return GiftSignService;
};