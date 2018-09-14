/**
 * Created by 61972 on 2017/11/8.
 */
const md5 = require("md5");
const request = require('request');
const moment = require('moment');
module.exports = app => {
    class CustomerController extends app.Controller {
        constructor(ctx) {
            super(ctx, ctx.service.customer);
        }

        async judgeCusOrMerForLogin() {
            const _body = this.ctx.request.body;
            const _query = this.ctx.query;
            const values = Object.assign(_body, _query);
            if (values.user_type == 1) {
                this.ctx.body = await this.customerLogin(values);

            } else if (values.user_type == 2) {
                this.ctx.body = await this.merchantLogin(values);
            } else {
                this.ctx.body = {success: false, message: '请传user_type'};
            }
        }

        async judgeCusOrMerForGetCurrent() {
            const _body = this.ctx.request.body;
            const _query = this.ctx.query;
            const user_type = this.ctx.cookies.get('customer_type');
            const values = Object.assign(_body, _query);
            if (user_type == 1) {
                this.ctx.body = await this.getCurrentCustomer(values);

            } else if (user_type == 2) {
                this.ctx.body = await this.getCurrentMerchant(values);
            } else {
                this.ctx.body = {success: false, message: '未登录'};
            }
        }

        async judgeCusOrMerForRegister() {
            const _body = this.ctx.request.body;
            const _query = this.ctx.query;
            const values = Object.assign(_body, _query);
            if (values.user_type == 1) {
                this.ctx.body = await this.customerRegister(values);

            } else if (values.user_type == 2) {
                this.ctx.body = await this.merchantRegister(values);
            } else {
                this.ctx.body = {success: false, message: '请传user_type'};
            }
        }

        async onLogin() {  //小程序获取openid接口
            const values = this.ctx.query;
            const params = {
                js_code: values.code,
                appid: 'wx0df80edd8bbff014',
                secret: 'e423f55701c8e54e8913c9ba4230e0e4',
                grant_type: 'authorization_code',
            };
            try {
                const result = await this.ctx.curl('https://api.weixin.qq.com/sns/jscode2session', {
                    // 必须指定 method
                    method: 'GET',
                    data: params,
                    dataType: 'json',
                    timeout:10000,
                });
                this.ctx.body = {success: true, data: {openid: result.data.openid}};
            } catch (err) {
                this.ctx.body = {success: false, message: err};
            }

        }

        async create() {
            const values = this.ctx.request.body;
            const user_id = this.ctx.cookies.get('user_id');
            if (!values.operator_id) {
                values.operator_id = user_id;
            }
            return super.create(values);
        }

        async update() {
            const values = this.ctx.request.body;
            console.log(values);
            // const id = this.ctx.params[this.param];
            const params = {};
            if (values.name) {
                params.name = values.name;
            }
            if (values.shop_id) {
                params.shop_id = values.shop_id;
            }
            if (values.role_id) {
                params.role_id = values.role_id;
            }
            if (values.img) {
                params.img = values.img;
            }
            const user_id = this.ctx.cookies.get('user_id');
            if (!values.operator_id) {
                values.operator_id = user_id;
            }
            if (values.password && values.oldPassword) {
                console.log(666666666666)
                const id = this.ctx.cookies.get('id');
                const _user = await this.Service.findById(this.ctx.params.id);

                let url = '';
                let _params = {
                    FKEY: 'USERNAME',
                    id: id,
                    password: values.password || '',
                    oldPassword: values.oldPassword,
                };
                const customer_type = this.ctx.cookies.get('customer_type') || 1;
                if (customer_type == 1) {
                    url = '/customer/updatePwd';
                    //  _params.customerCode = values.customer_code;
                }
                else if (customer_type == 2) {
                    url = '/merchant/updatePwd';
                    //   _params.merchantCode = values.merchant_code;
                }

                const result = await this.ctx.curl(app.config.SKAPI + url, {
                    // 必须指定 method
                    method: 'GET',
                    data: _params,
                    // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
                    dataType: 'json',
                    timeout:10000,
                });
                if (result.data.flag === true) {
                    return super.update(params);
                } else {
                    this.ctx.body = {success: false, message: result.data.msg}
                }
            }
            else {
                return super.update(params);
            }

        }

        async forgetPass() {
            const values = this.ctx.request.body;

            const customer_type = values.user_type;
            let url = '';
            let check_url = '';
            const check_params = {
                FKEY: 'USERNAME',
                phone: values.phone,
            };

            if (customer_type == 1) {
                url = '/customer/resetPwd';
                check_url = '/customer/checkCustomer';
                check_params.customerName = values.customerName;
            }
            else if (customer_type == 2) {
                url = '/merchant/resetPwd';
                check_url = '/merchant/checkMerchant';
                check_params.merchantName = values.merchantName;
            }
            const _params = {
                FKEY: 'USERNAME',
                phone: values.phone,
                authCode: values.vcode,
            }
            const _result = await this.ctx.curl(app.config.SKAPI + '/sms/checkAuthCodeApi', {
                // 必须指定 method
                method: 'GET',
                data: _params,
                // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
                dataType: 'json',
            });
            if ((_result.data).flag === true && _result.data.result.authCodeCheck === 'LEGAL')//(_result.data).flag === true&&_result.data.result.authCodeCheck==='LEGAL'
            {
                const check_result = await this.ctx.curl(app.config.SKAPI + check_url, {
                    // 必须指定 method
                    method: 'GET',
                    data: check_params,
                    // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
                    dataType: 'json',
                    timeout:10000,
                });

                if (check_result.data.flag === true) {
                    console.log(check_result.data);
                    if (values.password) {
                        const _params = {
                            FKEY: 'USERNAME',
                            password: values.password
                        };


                        _params.id = check_result.data.data.id;
                        const result = await this.ctx.curl(app.config.SKAPI + url, {
                            // 必须指定 method
                            method: 'GET',
                            data: _params,
                            // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
                            dataType: 'json',
                        });
                        if (result.data.flag === true) {
                            this.ctx.body = {success: true, message: result.data.msg}
                        }
                        else {
                            this.ctx.body = {success: false, message: result.data.msg}
                        }
                    }
                    else {
                        this.ctx.body = {success: false, message: check_result.data.msg}
                    }

                }
                else {
                    this.ctx.body = {success: false, message: check_result.data.msg}
                }
            }
            else {
                this.ctx.body = {success: false, message: '验证码错误！'}
            }


        }

        async getCurrentCustomer(values) {
            const customer_username = this.ctx.cookies.get('customer_username');
            console.log(customer_username);
            if (customer_username) {
                const customer = await  this.Service.findOne({
                    include: !!values.include ? values.split(',') : [],
                    phone: customer_username,
                    user_type: 1
                });
                console.log(customer);
                console.log(customer.customer_code);
                const result = await this.ctx.curl(app.config.SKAPI + '/customer/customerDetail', {
                    // 必须指定 method
                    method: 'GET',
                    data: {
                        FKEY: 'USERNAME',
                        customerCode: customer.customer_code,
                    },
                    // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
                    dataType: 'json',
                    timeout:10000,
                });
                console.log(result);
                if (result.data.flag === true) {
                    customer.exch_points = result.data.data.score;
                    customer.total_points = result.data.data.totalIntegral;
                    return {success: true, data: customer, message: '查找成功'};
                }
                else {
                    return {success: false, message: result.data.msg}
                }

            }
            else {
                return {success: false, message: '未登录'};
            }
        }

        async customerRegister(values) {
            //  const values = this.ctx.request.body;
            console.log(values);
            const str = md5('pss' + moment(new Date()).format('YYYYMMDD'));
            try {
                const _params = {
                    FKEY: 'USERNAME',
                    phone: values.phone,
                    authCode: values.vcode,
                }
                const _result = await this.ctx.curl(app.config.SKMSGAPI + '/sms/checkAuthCodeApi', {
                    // 必须指定 method
                    method: 'GET',
                    data: _params,
                    // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
                    dataType: 'json',
                    timeout:10000,
                });
                if(_result.data.result.authCodeCheck === 'LEGAL')
                {
                    const result = await this.ctx.curl(app.config.SKAPI + '/customer/register', {
                        // 必须指定 method
                        method: 'GET',
                        data: {
                            FKEY: 'USERNAME',
                            customerName: values.name || '',
                            phone: values.phone || '',
                            idCard: values.certificate_code || '',
                            password: values.password || '',
                            openId: values.openid || '',
                        },
                        // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
                        dataType: 'json',
                        timeout:10000,
                    });

                    if ((result.data).flag === true) {
                        const _values = {
                            customer_code: result.data.data.custId,
                            name: values.name,
                            phone: values.phone,
                            certificate_code: values.certificate_code,
                            password: values.password,
                            user_type: 1
                        }
                        this.Service.create(_values)

                        return {
                            success: true,
                            message: (result.data).msg,
                            data: (result.data).data
                        };
                    }
                    else {
                        return {success: false, message: (result.data).msg};
                    }
                }
                else
                {
                    return {success: false, message: '验证码错误'};
                }



                // super.create(values)

            } catch (err) {
                console.log(err);
                return {success: false, message: '接口链接错误！', err: err};
            }
        }

        async customerLogin(values) {
            // const values = this.ctx.request.body;
            console.log('正在登陆');
            console.log(values);
            console.log(this.ctx.cookies.get('customer_username'));
            const str = md5('pss' + moment(new Date()).format('YYYYMMDD'));
            try {
                const result = await this.ctx.curl(app.config.SKAPI + '/customer/login', {
                    // 必须指定 method
                    method: 'GET',
                    data: {
                        FKEY: 'USERNAME',
                        phone: values.phone,
                        password: values.password,
                    },
                    // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
                    dataType: 'json',
                    timeout:10000,
                });

                const _params = {
                    FKEY: 'USERNAME',
                    phone: values.phone,
                    authCode: values.vcode,
                }
                const _result = await this.ctx.curl(app.config.SKMSGAPI + '/sms/checkAuthCodeApi', {
                    // 必须指定 method
                    method: 'GET',
                    data: _params,
                    // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
                    dataType: 'json',
                    timeout:10000,
                });
                console.log(_result)
                if ((_result.data).flag === true && _result.data.result.authCodeCheck === 'LEGAL')//
                {
                    if ((result.data).flag === true) {
                        this.ctx.cookies.set('customer_username', values.phone, {maxAge: 1000 * 60 * 60 * 72});
                        this.ctx.cookies.set('customer_type', 1, {maxAge: 1000 * 60 * 60 * 72});
                        this.ctx.cookies.set('id', (result.data.data.id).toString(), {maxAge: 1000 * 60 * 60 * 72});
                        //   this.ctx.cookies.set('customer_code', (result.data.data.id).toString(), {maxAge: 1000 * 60 * 60 * 72});

                        if (values.sync) {
                            const user = await this.Service.findOne({phone: values.phone});
                            console.log(user);
                            return {
                                success: true,
                                data: Object.assign((result.data).data, {localData: user}),
                            };
                        }
                        else {
                            return {success: true, data: (result.data).data};
                        }
                    } else {
                        return {success: false, message: (result.data).msg};
                    }
                }
                else {
                    return {success: false, message: '验证码不正确'};
                }

            } catch (err) {
                return {success: false, message: '接口链接错误！'};
            }


        }

        async checkCustomer() {
            const values = this.ctx.query;
            console.log(values);
            const str = md5('pss' + moment(new Date()).format('YYYYMMDD'));
            const result = await this.ctx.curl(app.SKAPI + '/customer/checkCustomer', {
                // 必须指定 method
                method: 'GET',
                data: {
                    FKEY: 'USERNAME',
                    phone: values.phone,
                    password: values.password,
                },
                // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
                dataType: 'json',
                timeout:10000,
            });
            this.ctx.body = {success: true, data: (result.data).data};
        }

        async resetPwd() {
            const values = this.ctx.request.body;
            console.log(values);
            const str = md5('pss' + moment(new Date()).format('YYYYMMDD'));
            const result = await this.ctx.curl(app.config.SKAPI + '/customer/resetPwd', {
                // 必须指定 method
                method: 'GET',
                data: {
                    FKEY: 'USERNAME',
                    id: values.id,
                    password: values.password,
                },
                // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
                dataType: 'json',
                timeout:10000,
            });
            this.ctx.body = {success: true, data: (result.data).data};
        }

        async detailList() {
            //const values = this.ctx.request.body;
            const values = this.ctx.query;
            const str = md5('pss' + moment(new Date()).format('YYYYMMDD'));
            const params = {
                FKEY: 'USERNAME',
                rows: values.rows || 10000,
                page: values.page || 1,
                sort: values.sort || 'createTime',
                order: values.order || 'desc',
                customerCode: values.customer_code,
            };
            const _params = {
                FKEY: 'USERNAME',
                customerCode: values.customer_code,
            }
            if (values.beginDate && values.endDate) {
                params.beginDate = moment(new Date(parseInt(values.beginDate))).format('YYYY-MM-DD');
                params.endDate = moment(new Date(parseInt(values.endDate))).format('YYYY-MM-DD');
                _params.beginDate = moment(new Date(parseInt(values.beginDate))).format('YYYY-MM-DD');
                _params.endDate = moment(new Date(parseInt(values.endDate))).format('YYYY-MM-DD');
            }
            console.log(params);
            const result = await this.ctx.curl(app.config.SKAPI + '/integralDetail/detailList', {
                // 必须指定 method
                method: 'GET',
                data: params,
                // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
                dataType: 'json',
                timeout:10000,
            });
            const _result = await this.ctx.curl(app.config.SKAPI + '/integralDetail/statistics', {  //统计
                // 必须指定 method
                method: 'GET',
                data: _params,
                // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
                dataType: 'json',
            });


            if ((_result.data).flag && (result.data).flag) {
                if ((result.data).data) {
                    if ((_result.data).data) {
                        this.ctx.body = {
                            success: true,
                            message: (result.data).msg,
                            data: Object.assign((result.data).data, {stat: (_result.data).data})
                        };

                    }
                    else {
                        this.ctx.body = {
                            success: true,
                            message: (result.data).msg,
                            data: Object.assign((result.data).data, {stat: ''})
                        };
                    }
                }
                else {
                    this.ctx.body = {success: false, message: (result.data).msg,};
                }
            }
            else {
                this.ctx.body = {success: false, message: (result.data).msg,};
            }
        }

        async exchangeScore() {
            const values = this.ctx.request.body;
            console.log(values);
            const str = md5('pss' + moment(new Date()).format('YYYYMMDD'));
            const result = await this.ctx.curl(app.SKAPI + '/integralDetail/exchangeScore', {
                // 必须指定 method
                method: 'GET',
                data: {
                    FKEY: 'USERNAME',
                    customerCode: values.customer_code,
                    score: values.score,
                },
                // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
                dataType: 'json',
                timeout:10000,
            });
            this.ctx.body = {success: true, data: (result.data).data};
        }

        async customerDetail() {
            //const values = this.ctx.request.body;
            const values = this.ctx.query;
            console.log(values);
            const str = md5('pss' + moment(new Date()).format('YYYYMMDD'));
            const result = await this.ctx.curl(app.config.SKAPI + '/customer/customerDetail', {
                // 必须指定 method
                method: 'GET',
                data: {
                    FKEY: 'USERNAME',
                    customerCode: values.customer_code,
                },
                // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
                dataType: 'json',
                timeout:10000,
            });
            this.ctx.body = {success: true, message: (result.data).msg, data: (result.data).data};
        }


        async getCurrentMerchant(values) {
            const merchant_username = this.ctx.cookies.get('customer_username');
            if (merchant_username) {
                const customer = await  this.Service.findOne({
                    include: !!values.include ? values.include.split(',') : [],
                    phone: merchant_username,
                    user_type: 2
                });
                const result = await this.ctx.curl(app.config.SKAPI + '/merchant/merchantDetail', {
                    // 必须指定 method
                    method: 'GET',
                    data: {
                        FKEY: 'USERNAME',
                        merchantCode: customer.merchant_code,
                    },
                    // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
                    dataType: 'json',
                    timeout:10000,
                });
                console.log(result);
                if (result.data.flag === true) {
                    customer.exch_points = result.data.data.score;
                    customer.total_points = result.data.data.totalIntegral;
                    return {success: true, data: customer, message: '查找成功'};
                }
                else {
                    return {success: false, message: result.data.msg}
                }

            }
            else {
                return {success: false, message: '未登录'};
            }
        }

        async checkMerchantExist() {
            const values = this.ctx.request.query;
            const merchant = await this.Service.findOne({phone: values.phone})
            console.log(merchant)
            if (merchant) {
                this.ctx.body = {success: true, merchantId: merchant.id, message: '存在'};
            }
            else {
                const _merchant = await this.Service.create(Object.assign(values, {user_type: 2}))
                this.ctx.body = {success: true, merchantId: _merchant.id, message: '新增'};
            }
        }

        async merchantRegister(values) {
            // const values = this.ctx.request.body;
            console.log(values);
            const str = md5('pss' + moment(new Date()).format('YYYYMMDD'));
            try {

                const _params = {
                    FKEY: 'USERNAME',
                    phone: values.phone,
                    authCode: values.vcode,
                }
                const _result = await this.ctx.curl(app.config.SKMSGAPI + '/sms/checkAuthCodeApi', {
                    // 必须指定 method
                    method: 'GET',
                    data: _params,
                    // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
                    dataType: 'json',
                    timeout:10000,
                });
                if(_result.data.result.authCodeCheck === 'LEGAL')
                {
                    const result = await this.ctx.curl(app.config.SKAPI + '/merchant/register', {
                        // 必须指定 method
                        method: 'GET',
                        data: {
                            FKEY: 'USERNAME',
                            merchantNum: values.merchant_code || '',
                            merchantName: values.name || '',
                            phone: values.phone,
                            password: values.password,
                            openId: values.openid || '',
                        },
                        // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
                        dataType: 'json',
                        timeout:10000,
                    });
                    if ((result.data).flag === true) {

                        const _values = {
                            merchant_code: values.merchant_code,
                            name: values.name,
                            phone: values.phone,
                            password: values.password,
                            user_type: 2
                        }
                        //  this.Service.create(_values)
                        const _merchant = this.Service.create(_values)
                        /* const params = {
                         name: values.name || '',
                         merchant_id: _merchant.id,
                         shop_type_id: values.shop_type_id || '1',
                         }
                         this.service.shop.create(params);*/
                        return {
                            success: true,
                            message: (result.data).msg,
                            data: (result.data).data,
                            merchantId: _merchant.id
                        };
                    }
                    else {
                        return {success: false, message: (result.data).msg};
                    }
                }
                else
                {
                    return {success: false, message: '验证码错误！'};
                }

            } catch (err) {
                console.log(err);
                return {success: false, message: '接口链接错误！', err: err};
            }


        }

        async getMerchantListByPhone() {
            const values = this.ctx.query;
            console.log(values);
            const str = md5('pss' + moment(new Date()).format('YYYYMMDD'));
            const result = await this.ctx.curl(app.config.SKAPI + '/merchant/getMerchantListByPhone', {
                // 必须指定 method
                method: 'GET',
                data: {
                    FKEY: 'USERNAME',
                    phone: values.phone,
                },
                // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
                dataType: 'json',
                timeout:10000,
            });
            this.ctx.body = {success: true, data: (result.data) && (result.data).data || []};
        }

        async merchantLogin(values) {
            //  const values = this.ctx.request.body;
            console.log(values);
            const str = md5('pss' + moment(new Date()).format('YYYYMMDD'));
            try {
                const result = await this.ctx.curl(app.config.SKAPI + '/merchant/login', {
                    // 必须指定 method
                    method: 'GET',
                    data: {
                        FKEY: 'USERNAME',
                        phone: values.phone,
                        password: values.password,
                        merchantNum: values.merchant_code,
                    },
                    // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
                    dataType: 'json',
                    timeout:10000,
                });
                const _params = {
                    FKEY: 'USERNAME',
                    phone: values.phone,
                    authCode: values.vcode,
                }
                const _result = await this.ctx.curl(app.config.SKMSGAPI + '/sms/checkAuthCodeApi', {
                    // 必须指定 method
                    method: 'GET',
                    data: _params,
                    // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
                    dataType: 'json',
                    timeout:10000,
                });
                if ((_result.data).flag === true && _result.data.result.authCodeCheck === 'LEGAL') //(_result.data).flag === true&&_result.data.result.authCodeCheck==='LEGAL'
                {
                    if ((result.data).flag === true) {
                        if ((result.data).data) {
                            this.ctx.cookies.set('customer_username', values.phone, {maxAge: 1000 * 60 * 60 * 72});
                            this.ctx.cookies.set('customer_type', 2, {maxAge: 1000 * 60 * 60 * 72});
                            this.ctx.cookies.set('id', (result.data.data.id).toString(), {maxAge: 1000 * 60 * 60 * 72});
                            if (values.sync) {
                                const user = await this.Service.findOne({phone: values.phone});
                                return {
                                    success: true,
                                    data: Object.assign((result.data).data, {localData: user}),
                                };
                            }
                            else {
                                const user = await this.Service.findOne({phone: values.phone});
                                return {success: true, data: (result.data).data};
                            }
                        }
                        else {
                            return {success: false, message: (result.data).msg};
                        }

                    } else {
                        return {success: false, message: (result.data).msg};
                    }
                }
                else {
                    return {success: false, message: '验证码不正确'};
                }

            } catch (err) {
                return {success: false, message: '接口链接错误！'};
            }

        }

        async checkMerchant() {
            const values = this.ctx.query;
            console.log(values);
            const str = md5('pss' + moment(new Date()).format('YYYYMMDD'));
            const result = await this.ctx.curl(app.SKAPI + '/merchant/register', {
                // 必须指定 method
                method: 'GET',
                data: {
                    FKEY: 'USERNAME',
                    merchantName: values.merchantName,
                    phone: values.phone,
                    merchantNum: values.merchantNum,
                },
                // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
                dataType: 'json',
                timeout:10000,
            });
            this.ctx.body = {success: true, data: (result.data).data};
        }

        async merchantResetPwd() {
            const values = this.ctx.request.body;
            console.log(values);
            const str = md5('pss' + moment(new Date()).format('YYYYMMDD'));
            const result = await this.ctx.curl(app.config.SKAPI + '/merchant/resetPwd', {
                // 必须指定 method
                method: 'GET',
                data: {
                    FKEY: 'USERNAME',
                    id: values.id,
                    password: values.password,
                },
                // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
                dataType: 'json',
                timeout:10000,
            });
            this.ctx.body = {success: true, data: (result.data).data};
        }

        async merchantDetailList() {
            // const values = this.ctx.request.body;
            const values = this.ctx.query;
            console.log(values);
            const str = md5('pss' + moment(new Date()).format('YYYYMMDD'));
            const params = {
                FKEY: 'USERNAME',
                rows: values.rows || 10000,
                page: values.page || 1,
                sort: values.sort || 'createTime',
                order: values.order || 'desc',
                merchantCode: values.merchant_code,
            }
            const _params = {
                FKEY: 'USERNAME',
                merchantCode: values.merchant_code,
            }
            if (values.beginDate && values.endDate) {
                params.beginDate = moment(new Date(parseInt(values.beginDate))).format('YYYY-MM-DD')
                params.endDate = moment(new Date(parseInt(values.endDate))).format('YYYY-MM-DD')
                _params.beginDate = moment(new Date(parseInt(values.beginDate))).format('YYYY-MM-DD');
                _params.endDate = moment(new Date(parseInt(values.endDate))).format('YYYY-MM-DD');
            }
            console.log(params);
            const result = await this.ctx.curl(app.config.SKAPI + '/merchantIntegralDtl/detailList', {
                // 必须指定 method
                method: 'GET',
                data: params,
                // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
                dataType: 'json',
                timeout:10000,
            });
            console.log(_params);
            const _result = await this.ctx.curl(app.config.SKAPI + '/merchantIntegralDtl/statistics', {  //统计
                // 必须指定 method
                method: 'GET',
                data: _params,
                // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
                dataType: 'json',
            });
            if ((_result.data).flag && (result.data).flag) {
                if ((result.data).data) {
                    if ((_result.data).data) {
                        this.ctx.body = {
                            success: true,
                            message: (result.data).msg,
                            data: Object.assign((result.data).data, {stat: (_result.data).data})
                        };

                    }
                    else {
                        this.ctx.body = {
                            success: true,
                            message: (result.data).msg,
                            data: Object.assign((result.data).data, {stat: ''})
                        };
                    }
                }
                else {
                    this.ctx.body = {success: false, message: (result.data).msg,};
                }
            }
            else {
                this.ctx.body = {success: false, message: (result.data).msg,};
            }

        }

        async merchantExchangeScore() {
            const values = this.ctx.request.body;
            console.log(values);
            const str = md5('pss' + moment(new Date()).format('YYYYMMDD'));
            const result = await this.ctx.curl(app.SKAPI + '/merchantIntegralDtl/exchangeScore', {
                // 必须指定 method
                method: 'GET',
                data: {
                    FKEY: 'USERNAME',
                    merchantCode: values.merchant_code,
                    score: values.score,
                },
                // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
                dataType: 'json',
                timeout:10000,
            });
            this.ctx.body = {success: true, data: (result.data).data};
        }

        async merchantDetail() {
            //const values = this.ctx.request.body;
            const values = this.ctx.query;
            console.log(values);
            const str = md5('pss' + moment(new Date()).format('YYYYMMDD'));
            const result = await this.ctx.curl(app.config.SKAPI + '/merchant/merchantDetail', {
                // 必须指定 method
                method: 'GET',
                data: {
                    FKEY: 'USERNAME',
                    /* rows:values.rows,
                     page:values.page,
                     sort:values.sort,
                     order:values.order,*/
                    merchantCode: values.merchant_code,
                },
                // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
                dataType: 'json',
                timeout:10000,
            });
            this.ctx.body = {success: true, data: (result.data).data};
        }
    }

    return CustomerController;
};