'use strict';

module.exports = app => {
    class ExamineService extends app.Service {
        constructor(ctx) {
            super(ctx, app.model.Examine, {
                associations: {
                    'gift': {model: app.model.Gift, as: 'gift'}, // alias
                    'sub_netspot': {model: app.model.Netspot, as: 'sub_netspot'}, // alias
                    'operator': {model: app.model.User, as: 'operator'}, // alias
                    'applicant': {model: app.model.Staff, as: 'applicant'}, // alias
                    'examine_person': {model: app.model.User, as: 'examine_person'}, // alias
                    'netspot': {model: app.model.Netspot, as: 'netspot'}, // alias
                },
                queries: {
                    id: false,
                    name: true,
                    status: function(attr, val, where){
						val = val.split(',');
						if(val.length === 2){
							where.status = {};
							if(!!val[0]){
								where.status['$gte'] = val[0];
							}
							if(!!val[1]){
								where.status['$lt'] = val[1];
							}
						} else {
							where.status = val[0];
						}
					},
                    is_allocation:false,
                    gift_id:false,
                    sub_netspot_id:false,
                    applicant_id:false,
                    examine_person_id:false,
                    examine_time:app.Service.TimeQuery,
                    netspot_id:false,
                },

            });
        }
    }

    return ExamineService;
};