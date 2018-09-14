'use strict';

module.exports = app => {
    class RoleService extends app.Service {
        constructor(ctx) {
            super(ctx, app.model.Role, {
                associations: {
                    //'parent_area': {model: app.model.Banner, as: 'parent_area'}, // alias
                    'operator': {model: app.model.User, as: 'operator'}, // alias
                },
                queries: {
                    id: false,
                    name: true,
                    status:false,
                    enabled:false,
                },

            });
        }


    }

    return RoleService;
};