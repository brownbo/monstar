//'use strict';

module.exports = app => {
    class StaffController extends app.Controller {
        constructor(ctx) {
            super(ctx, ctx.service.staff);
        }
        async create (){
            const values = this.ctx.request.body;
            const user_id = this.ctx.cookies.get('user_id');
            if(!values.operator_id)
            {
                values.operator_id = user_id;
            }
            /*try {
                const data = await this.Service.create(values);
                this.ctx.body = {success:true,data:data};
                //return this.responseJSON(this.Service.create(values));
            }
            catch (err){
                this.ctx.body = {success:false,err:err};
                console.log(err);
            }*/
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
            const username = this.ctx.cookies.get('username');
            if (username)
            {

                const staff = await  this.Service.findOne({include:!!this.ctx.query.include?this.ctx.query.include.split(','):[],phone:username});
                this.ctx.body ={success:true,data:staff,message:'查找成功'} ;
            }
            else
            {
                this.ctx.body ={success:false,message:'未登录'} ;
            }
        }
        async login() {
            const {phone, password,vcode} = this.ctx.request.body;
            console.log(phone)
            console.log(password)
            const user = await this.service.staff.login({phone});
            console.log(user);
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
                if((_result.data).flag === true&&_result.data.result.authCodeCheck==='LEGAL')//(_result.data).flag === true&&_result.data.result.authCodeCheck==='LEGAL'
                {
                    if(user.password===password)
                    {
                        this.ctx.cookies.set('username',user.phone,{maxAge:1000*60*60*72});
                        this.ctx.body = {success: true,data:user, message: '登录成功'};
                    }else
                    {
                        this.ctx.body = {success: false, message: '密码不正确'};
                    }
                }
                else
                {
                    this.ctx.body = {success: false, message: '验证码错误'};
                }


            }
            else
            {
                this.ctx.body = {success: false, message: '用户未找到'};
            }
        }
        async changePass() {
            const id = this.ctx.params.id;
            const { oldPassword,password} = this.ctx.request.body;
            const staff =this.responseJSON(this.service.staff.changePass({id,oldPassword,password}));
            return staff;
        }
    }

    return StaffController;
};