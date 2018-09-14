'use strict';

module.exports = app => {
    class AreaService extends app.Service {
        constructor(ctx) {
            super(ctx, app.model.User, {
                associations: {
                    'role': {model: app.model.Role, as: 'role'}, // alias
                    'operator': {model: app.model.User, as: 'operator'}, // alias
                },
                queries: {
                    id: false,
                    username: false,
                    password:false,
                },

            });

        }
        async login(params){
            const user = await app.model.User.findOne({where:{
                username: params.username, // equalTo
            }});
            return (user);
        }
        async add(params) {
            return app.model.User.create(params);
        }
        async changePass(params){
            const user = await app.model.User.findById(params.id);
            if(user)
            {
                console.log(user.password)
                console.log(params.oldPassword)
                if(user.password===params.oldPassword)
                {
                    const _user = await this.update(params.id,{password:params.password});
                    return _user;
                }else
                {
                    throw new Error('旧密码不正确')
                }

            }
            else
            {
                throw new Error('未找到用户信息')
            }
        }

    }

    return AreaService;
};