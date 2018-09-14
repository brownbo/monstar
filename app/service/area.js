'use strict';

module.exports = app => {
  class AreaService extends app.Service {
    constructor(ctx) {
      super(ctx, app.model.Area, {
        associations: {
            'parent_area': {model: app.model.Area, as: 'parent_area'}, // alias
            'operator': {model: app.model.User, as: 'operator'}, // alias
        },
        queries: {
          id: false,
          name: true,
          parent_area_id:false
        },

      });
    }

    
  }

  return AreaService;
};