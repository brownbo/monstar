'use strict';

module.exports = app => {
    class MerchantService extends app.Service {
        constructor(ctx) {
            super(ctx, app.model.Merchant, {
                associations: {
                    //'parent_area': {model: app.model.Banner, as: 'parent_area'}, // alias
                    'operator': {model: app.model.User, as: 'operator'}, // alias
                    'shop': {model: app.model.Shop, as: 'shop'},
                },
                queries: {
                    id: false,
                    name: true,
                    phone:true,
                    shop_code:true,
                },

            });
        }
        async changePass(params){
            const merchant = await app.model.Merchant.findById(params.id);
            if(merchant)
            {
                console.log(merchant.password)
                console.log(params.oldPassword)
                if(merchant.password===params.oldPassword)
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
                throw new Error('未找到商户信息')
            }
        }

        async resetPass(params){
            const merchant = await app.model.Merchant.findOne({phone:params.phone});
            if(merchant)
            {
                const _staff = await this.update(merchant.id,{password:params.password});
                return _staff;
            }
            else
            {
                throw new Error('未找到商户信息')
            }
        }
    }

    return MerchantService;
};