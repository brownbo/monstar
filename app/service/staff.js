'use strict';

module.exports = app => {
    class StaffService extends app.Service {
        constructor(ctx) {
            super(ctx, app.model.Staff, {
                associations: {
                    'netspot': {model: app.model.Netspot, as: 'netspot'}, // alias
                    'operator': {model: app.model.User, as: 'operator'}, // alias
                },
                queries: {
                    id: false,
                    name: true,
                    phone:false,
                    username:false,
                    netspot_id:false,
                },

            });
        }
        async login(params){
            const user = await app.model.Staff.findOne({where:{
                phone: params.phone, // equalTo
            }});
            return (user);
        }
        async changePass(params){
            const staff = await app.model.Staff.findById(params.id);
            if(staff)
            {
                console.log(staff.password)
                console.log(params.oldPassword)
                if(staff.password===params.oldPassword)
                {
                    const _staff = await this.update(params.id,{password:params.password});
                    return _staff;
                }else
                {
                    throw new Error('旧密码不正确')
                }

            }
            else
            {
               throw new Error('未找到员工信息')
            }
        }

    }

    return StaffService;
};