/**
 * Created by 61972 on 2018/1/9.
 */
'use strict';
module.exports = options => {
    async function wechatAuth(ctx, next) {
        const customer_username = ctx.cookies.get('customer_username');
        if(!!customer_username)
        {
            await next();
        }
        else
        {
            await next();
            //ctx.body={success:false,message:'未登录'}
        }
    }
    return wechatAuth;
}