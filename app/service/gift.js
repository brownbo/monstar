'use strict';

module.exports = app => {
    class GiftService extends app.Service {
        constructor(ctx) {
            super(ctx, app.model.Gift, {
                associations: {
                    'gift_type': {model: app.model.GiftType, as: 'gift_type'}, // alias
                    //'parent_area': {model: app.model.Banner, as: 'parent_area'}, // alias
                    'operator': {model: app.model.User, as: 'operator'}, // alias
                    'activity': {model: app.model.Activity, as: 'activity'}, // alias
                },
                queries: {
                    id: false,
                    name: true,
                    brand:true,
                    price:false,
                    gift_type_id:false,
                    is_active: function(attr, val, where){
                        where['$and'] =[app.Sequelize.where(app.Sequelize.col('activity.enabled'), '=', 1)]//   {'$like':'%' + val + '%' };
                    },
                    exch_points:app.Service.pointsQuery,
                    enabled:false,
                },

            });
        }
        findAll(opts, _opts={}){
            if(opts.availableGifts&&opts.mypoints) {
                _opts.where = { '$or' : {} }
                opts.include = [ 'activity',];
                _opts.group = ['gift.id'];
                _opts.where['$or'] = [
                    {
                        '$and': [
                            app.Sequelize.where(app.Sequelize.col('activity.exch_points'), '<=', ~~opts.mypoints),
                            app.Sequelize.where(app.Sequelize.col('activity.enabled'), '=', 1)
                        ]
                    },
                   // app.Sequelize.where(app.Sequelize.col('activity.exch_points'), '<=', ~~opts.mypoints),
                    app.Sequelize.where(app.Sequelize.col('gift.exch_points'), '<=', ~~opts.mypoints)]
            }
            return super.findAll(opts,_opts);
        }


    }

    return GiftService;
};