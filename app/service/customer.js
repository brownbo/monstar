/**
 * Created by 61972 on 2017/11/8.
 */
'use strict';

module.exports = app => {
    class CustomerService extends app.Service {
        constructor(ctx) {
            super(ctx, app.model.Customer, {
                associations: {
                    'shop': {model: app.model.Shop, as: 'shop'}, // alias
                  //  'role': {model: app.model.Role, as: 'role'}, // alias
                    'operator': {model: app.model.User, as: 'operator'}, // alias
                },
                queries: {
                    id: false,
                    name: true,
                    username:false,
                    phone:true,
                },

            });
        }
        async add(params) {
            return app.model.Customer.create(params);
        }
    }

    return CustomerService;
};