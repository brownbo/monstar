//'use strict';

module.exports = app => {
    class MerchantController extends app.Controller {
        constructor(ctx) {
            super(ctx, ctx.service.merchant);
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
        async getCurrent() {
            const merchant_username = this.ctx.cookies.get('merchant_username');
            if (merchant_username)
            {

                const merchant = await  this.Service.findOne({include:!!this.ctx.query.include?this.ctx.query.include.split(','):[],phone:merchant_username});
                this.ctx.body ={success:true,data:merchant,message:'查找成功'} ;
            }
            else
            {
                this.ctx.body ={success:false,message:'未登录'} ;
            }
        }
        async login() {
            const {phone, password,vcode} = this.ctx.request.body;
            const user = await this.Service.findOne({phone});
            console.log(this.ctx.request.body)
            if(user)
            {
                const _params = {
                    FKEY:'USERNAME',
                    phone:phone,
                    authCode:vcode,
                }
                const _result = await this.ctx.curl(app.config.SKMSGAPI + '/sms/checkAuthCodeApi', {
                    // 必须指定 method
                    method: 'GET',
                    data: _params,
                    // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
                    dataType: 'json',
                });
                console.log(_result)
                if((_result.data).flag === true&&_result.data.result.authCodeCheck==='LEGAL')//(_result.data).flag === true&&_result.data.result.authCodeCheck==='LEGAL'
                {
                    if(user.password===password)
                    {
                        this.ctx.cookies.set('merchant_username',user.phone,{maxAge:1000*60*60*72});
                        this.ctx.body = {success: true,data:user, message: '登录成功'};
                    }else
                    {
                        this.ctx.body = {success: false, message: '密码不正确'};
                    }
                }
                else
                {
                    this.ctx.body = {success: false, message: '验证码不正确'};
                }


            }
            else
            {
                this.ctx.body = {success: false, message: '用户未找到'};
            }
        }
        async forgetPass() {
          //  const id = this.ctx.params.id;
            const { password,phone ,vcode} = this.ctx.request.body;
            const _params = {
                FKEY:'USERNAME',
                phone:phone,
                authCode:vcode,
            }
            const _result = await this.ctx.curl(app.config.SKAPI + '/sms/checkAuthCodeApi', {
                // 必须指定 method
                method: 'GET',
                data: _params,
                // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
                dataType: 'json',
            });
            console.log(_result)
            if((_result.data).flag === true&&_result.data.result.authCodeCheck==='LEGAL')//(_result.data).flag === true&&_result.data.result.authCodeCheck==='LEGAL'
            {
                const merchant =this.responseJSON(this.Service.resetPass({phone,password}));
                return merchant;
            }
            else
            {
                this.ctx.body = {success: false, message: '验证码不正确'};
            }





        }
        async changePass() {
            const id = this.ctx.params.id;
            const { oldPassword,password} = this.ctx.request.body;
            const merchant =this.responseJSON(this.Service.changePass({id,oldPassword,password}));
            return merchant;
        }
        async sign(){
            const values = this.ctx.request.body;
            const name = values.name;
            const merId = values.merchant_code;
            const shop =await this.service.shop.findOne({name:name,merId:merId});
            console.log(shop)
            /*if(shop&&shop.merchant_id)
            {
                this.ctx.body={success:false,message:'该商铺已经绑定管理员！'};
            }
            else */
            if(shop)
            {
                const cusParams = {
                    phone:values.phone,
                    username:values.phone,
                    name:values.phone,
                    password:values.password,
                    shop_id:shop.id,
                }
                const newMer =await this.Service.create(cusParams);
              //  const newShop = await this.service.shop.update(shop.id,{merchant_id:newMer.id});
                this.ctx.body={success:true,shop:shop,merchant:newMer};
            }
            else
            {
                this.ctx.body={success:false,message:'商户还未新增到农信银行'};
            }
        }
    }

    return MerchantController;
};