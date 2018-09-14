//'use strict';
const fs = require('fs');
const path = require('path');
module.exports = app => {
    class UserController extends app.Controller {
        constructor(ctx) {
            super(ctx, ctx.service.user);
        }
        async sendSmsApi(){
            const values = this.ctx.query;
            const _params = {
                FKEY:'USERNAME',
                phone:values.phone,
            }
            const result = await this.ctx.curl(app.config.SKMSGAPI + '/sms/sendSmsApi', {
                // 必须指定 method
                method: 'GET',
                data: _params,
                // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
                dataType: 'json',
            });
            console.log(result);
            if (result.data.flag === true) {
                this.ctx.body={success:true}
            }
            else
            {
                this.ctx.body={success:false,message:result.data.msg}
            }
        }
        async checkAuthCodeApi(){
            const values = this.ctx.query;
            const _params = {
                FKEY:'USERNAME',
                phone:values.phone,
                authCode:values.vcode,
            }
            const result = await this.ctx.curl(app.config.SKMSGAPI + '/sms/checkAuthCodeApi', {
                // 必须指定 method
                method: 'GET',
                data: _params,
                // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
                dataType: 'json',
            });
            console.log(result);
            if (result.data.flag === true&&result.data.result.authCodeCheck==='LEGAL') {
                this.ctx.body={success:true}
            }
            else
            {
                this.ctx.body={success:false,message:result.data.result.text}
            }
        }
        async showAdmin(){
            this.ctx.type='html';
            this.ctx.body=fs.createReadStream(path.join(app.baseDir,'app/view/index.html'));
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
        async login() {
            const {username, password} = this.ctx.request.body;
            console.log(username)
            console.log(password)
            const user = await this.service.user.findOne({username:username,include:['role']});
            if(user&&user.role&&user.role.enabled===1)
            {
                if(user.password==password)
                {
                    this.ctx.cookies.set('username',user.username,{maxAge:1000*60*60*72});
                    this.ctx.cookies.set('user_id',user.id,{maxAge:1000*60*60*72});
                    this.ctx.body = {success: true,data:user, message: '登录成功'};
                }else
                {
                    this.ctx.body = {success: false, message: '密码不正确'};
                }

            }
            else
            {
                this.ctx.body = {success: false, message: '用户未找到或用户已被禁用'};
            }
        }
        async changePass() {
            const id = this.ctx.params.id;
            const { oldPassword,password} = this.ctx.request.body;
            const user =this.responseJSON(this.Service.changePass({id,oldPassword,password}));
            return user;
        }
        async userRegister(){
            const values = this.ctx.request.body;
            console.log(values);
            if(values.username&&values.password)
            {
                const user = await this.service.user.findOne({username:values.username});
                if(user)
                {
                    this.ctx.body={success:false,message:'用户已经存在！'};
                }
                else
                {
                    const new_user = await this.service.user.add(values);
                    this.ctx.body={success:true,data:new_user};
                }
                console.log(user);
            }
            else
            {
                this.ctx.body={success:false,message:'输入用户名和密码！'};
            }


        }
        async logout(){
            this.ctx.cookies.set('username', null);
            this.ctx.body={success:true,message:'注销成功！'};
        }
        async getCurrent() { //获取当前
            const username = this.ctx.cookies.get('username');
            if(username)
            {
                const user = await this.service.user.findOne({username,include:['role']});
                console.log(user);
                this.ctx.body= {success:true,data:user};
            }
            else
            {
                this.ctx.body= {success:false,message:'未登录'};
            }


        }
    }


    return UserController;
};