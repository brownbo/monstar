//'use strict';

module.exports = app => {
    class GiftTypeController extends app.Controller {
        constructor(ctx) {
            super(ctx, ctx.service.giftType);
        }
        async create (){
            const values = this.ctx.request.body;
            const user_id = this.ctx.cookies.get('user_id');
            if(!values.operator_id)
            {
                values.operator_id = user_id;
            }
            return super.create(values);
        }
        async update (){
            const values = this.ctx.request.body;
            const user_id = this.ctx.cookies.get('user_id');
            if(!values.operator_id)
            {
                values.operator_id = user_id;
            }
            return super.update(values);
        }
    }

    return GiftTypeController;
};