/**
 * Created by 61972 on 2017/11/14.
 */
'use strict';
module.exports = options => {
     async function auth(ctx, next) {
        const username = ctx.cookies.get('username');
        if(!!username)
        {
            await next();
        }
        else
        {
            await next();
            //ctx.body={success:false,message:'未登录'}
        }
    }
    return auth;
}