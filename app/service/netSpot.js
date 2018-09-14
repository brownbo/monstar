'use strict';

module.exports = app => {
    class NetSpotService extends app.Service {
        constructor(ctx) {
            super(ctx, app.model.Netspot, {
                associations: {
                    'area': {model: app.model.Area, as: 'area'}, // alias
                  //  'staff': {model: app.model.Staff, as: 'staff'}, // alias
                    'operator': {model: app.model.User, as: 'operator'}, // alias
                },
                queries: {
                    id: false,
                    name: true,
                    is_parent:false,
                    area_id:false,
                    status:false,
                    phone:false,
                },

            });
        }
    }

    return NetSpotService;
};