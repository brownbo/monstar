'use strict';

module.exports = app => {
    class NotificationService extends app.Service {
        constructor(ctx) {
            super(ctx, app.model.Notification, {
                associations: {
                   // 'area': {model: app.model.Area, as: 'area'}, // alias
                    'operator': {model: app.model.User, as: 'operator'}, // alias
                },
                queries: {
                    id: false,
                    enabled: false,
                },

            });
        }
    }

    return NotificationService;
};