'use strict';

module.exports = app => {
    class ActivityService extends app.Service {
        constructor(ctx) {
            super(ctx, app.model.Activity, {
                associations: {
                 /*   'parent_area': {model: app.model.Area, as: 'parent_area'}, // alias
                    'operator': {model: app.model.User, as: 'operator'}, // alias*/
                },
                queries: {
                    id: false,


                },

            });
        }


    }

    return ActivityService;
};