//'use strict';

module.exports = app => {
    class ActivityController extends app.Controller {
        constructor(ctx) {
            super(ctx, ctx.service.activity);
        }
        /*async create (){
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
        }*/
        async update (){
            const values = this.ctx.request.body;
            const user_id = this.ctx.cookies.get('user_id');
            if(!values.operator_id)
            {
                values.operator_id = user_id;
            }
            /*if(!!values.enabled||values.enabled===0)
            {
              //  const _activity =
            }*/
            return super.update(values);
        }
    }

    return ActivityController;
};