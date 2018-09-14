/**
 * Created by 61972 on 2017/11/8.
 */
const UUID = require('uuid');
const main = require('./main');
const path = require('path');
const fs = require('fs');
const xlsx = require('node-xlsx');
module.exports = app => {
    class OrdersController extends app.Controller {
        constructor(ctx) {
            super(ctx, ctx.service.orders);
        }
        async list(){
            const values = this.ctx.query;
            if(values.goods_list)
            {
                const goods_list = (values.goods_list).split(',');
                console.log(goods_list)
                values.goods_id = goods_list;
            }
            if(values.voucher_list)
            {
                const voucher_list = (values.voucher_list).split(',');
                console.log(voucher_list)
                values.voucher_id = voucher_list;
            }
            if(values.show_all_settle&&values.stat)
            {
                this.handleOptions();
                const list  =await this.Service.findAll(Object.assign(this.ctx.query,{limit:1000000}));
                let _count =list.length;
                let amount = 0;
                list.map(_order=>{
                    amount+=_order.amount||0;
                    amount+=_order.sum_price||0
                })
                this.ctx.body={
                    success:true,
                    data:{
                        total_count:_count,
                        amount:amount
                    }
                }

            }else
            {
                return super.list();
            }

        }
        async payment() {
            const {orderId, frontUrl, endUrl} = this.ctx.query;
            const order = await this.Service.findById(orderId, {
                include: ['shop', 'goods', 'netspot', 'voucher', 'gift'], plain: false
            });
            order.status = 1;
            order.pay_time = new Date();
            await order.save()
            order.shop = order.shop || order.netspot;
            order.goods = order.goods || order.voucher || order.gift;
            const args = {
                frontEndUrl: frontUrl,
                backEndUrl: endUrl,
                merId: order.shop.parent_merId,
                orderType: '01',
                orderNumber: order.order_no,
                orderAmt: order.amount,
                payAmt: order.amount,
                subject: order.goods.name,
                orderCurrency: '01',
                userId: '',
                accessToken: '',
                channel: '02',
                mobileWay: '03',
                mobileType: /android/i.test(this.ctx.get('user-agent')) ? '01' : '02',
                customerIp: '',
                price: order.goods.amount || order.goods.price,
                quantity: order._count,
                body: order.goods.desc,
                url: '',
            };
            console.log(args);
            args.orderDetailList = JSON.stringify({
                orderAmt: args.orderAmt,
                payAmt: args.payAmt,
                payType: '',
                merLst: [{
                    merId: order.shop.merId,
                    parentMerId: order.shop.parent_merId === order.shop.merId ? '' : order.shop.parent_merId,
                    orderNumber: args.orderNumber,
                    subOrderAmt: args.orderAmt,
                    subPayAmt: args.payAmt,
                    logisCode: '400001',
                    logisType: '01',
                    comInfo: [{
                        consumeAmt: 0,
                        consumeType: '05'
                    }],
                    goodsInfo: [{
                        goodsSubject: order.goods.name,
                        goodsPrice: args.price,
                        goodsNum: String(args.quantity),
                        goodsUnit: '件',
                        goodsTotalAmt: args.price * args.quantity,
                        goodsSpec: "无"
                    }]
                }]
            }).replace(/"/g, '\'');
            return this.ctx.render('payment/payment', {payArgs: args, payUrl: this.config.bankAPI.pay});
        }

        async payfront() {
            return this.ctx.render('payment/payfront', this.ctx.query);
        }

        async payback() {
            const _body = this.ctx.request.body;
            const _query = this.ctx.query;
            const values = Object.assign(_body, _query);
            this.service.payment.payOrRefund(values);
            this.ctx.status = 200;
            this.ctx.body = 'ok';
            // main.payOrRefund(values);
        }

        async show() {
            const id = this.ctx.params.id;
            const _order =await this.Service.findById(id, this.ctx.query);
            if(_order.status===1||_order.status===-4&&_order.pay_type>0)
            {

                try {
                    let url ='';
                    if(_order.status===1)
                    {
                        url = app.config.bankAPI.search+'?merId='+app.config.shopCode+'&orderNumber='+_order.order_no+'&channel=01'
                    }
                    else
                    {
                        url = app.config.bankAPI.search+'?merId='+app.config.shopCode+'&orderNumber=TD_'+_order.order_no+'&channel=01'
                    }
                    const result = await this.ctx.curl(url, {
                        // 必须指定 method
                      /*  method: 'GET',
                        data: {
                            //  FKEY: 'USERNAME',
                            merId: app.config.shopCode,
                            orderNumber: _order.order_no || '',
                            channel: '01',
                        },*/
                        // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
                        dataType: 'json',
                    });
                    console.log(6666666666666666666)
                    console.log(result);
                    if (result.data.message === 'success' &&result.data.tranType==='01'&& result.data.orderStat === '02') {

                        console.log(11111111)
                        await this.Service.update(id, {status: 2});

                        return super.show()
                    }else if(result.data.message === 'success' &&result.data.tranType==='02'&& result.data.orderStat === '02'){
                        console.log(11111111)
                        await this.Service.update(id, {status: -3});
                        return super.show()
                    }
                    else {
                        console.log(222222222)
                        await this.Service.update(id, {status: 0});
                        return super.show()
                    }

                } catch (err) {
                    this.ctx.body = {success: false, err: err, message: '接口错误！'}
                }
            }
            else
            {
                return super.show();
            }


            //return super.show();
        }

        async update() {
            const id = this.ctx.params.id;
            const values = this.ctx.request.body;
            const user_id = this.ctx.cookies.get('user_id');
            if (!values.operator_id) {
                values.operator_id = user_id;
            }
            if(values.status===3)
            {
                console.log('订单为核销订单');
                const order = await this.Service.findById(id,{include:['shop','netspot']});
                order.shop = order.shop||order.netspot;
                if(order.amount>0)
                {
                    console.log({
                        merId: app.config.shopCode,
                        orderNumber: order.order_no,
                        settleMerNo: order.shop.merId,
                        subOrderNumber: order.order_no,
                    })
                    try {

                        const result = await this.ctx.curl(app.config.bankAPI.balance, {
                            // 必须指定 method
                            method: 'POST',
                            data: {
                                merId: app.config.shopCode,
                                orderNumber: order.order_no,
                                settleMerNo: order.shop.merId,
                                subOrderNumber: order.order_no,
                            },
                            dataType: 'json',
                        });
                        console.log(result)
                        if(result.data.message === 'success'){
                            if(order.pay_type===2)
                            {
                                values.sum_status = 2;
                            }
                            else
                            {
                                values.sum_status = 3;
                            }
                            values.sum_time = new Date();
                            return super.update(values);
                        }
                        else
                        {
                            this.ctx.body={
                                success:false,
                                message:result.data.message
                            }
                        }
                    }catch (err){
                        console.log(err);
                        this.ctx.body={success:false,message:err}
                    }
                }
                else
                {
                    return super.update(values);
                }

            }
            else
            {
                return super.update(values);
            }

        }
        async refund (){  //退货
            const id = this.ctx.params.id;
            const values = this.ctx.request.body;
            const refund_reason = values.reason;
            const refund_phone = values.phone;
            const refund_desc = values.desc;
            const refund_addr = values.addr;
            console.log(values);
            const order = await this.Service.findById(id,{include:['shop','netspot']});
            const status = order.status;
            if(order.status === -2||order.status===2)
            {
                if(order.total_points>0)
                {
                    try {
                        const customer_type = this.ctx.cookies.get('customer_type') || 1;
                        let url = '';
                        let params = {
                            FKEY: 'USERNAME',
                            score: order.total_points,
                        };
                        const _customer = await this.service.customer.findById(order.customer_id);
                        if (customer_type == 1) {
                            params.customerCode = _customer.customer_code;
                            url = '/integralDetail/backScore';
                        } else if (customer_type == 2) {
                            params.merchantCode = _customer.merchant_code;
                            url = '/merchantIntegralDtl/backScore';
                        }
                        const result = await this.ctx.curl(app.config.SKAPI + url, {
                            // 必须指定 method
                            method: 'GET',
                            data: params,
                            // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
                            dataType: 'json',
                        });

                        if(result.data.flag===true)
                        {
                            console.log(result);
                        }
                    }
                    catch (err){
                        console.log(err);
                        this.ctx.body={success:false,message:'err'}
                    }


                }

                console.log(123);
                if(order.amount===0)
                {
                    await this.Service.update(id,{
                        status:-3,
                        refund_reason:refund_reason,
                        refund_phone:refund_phone,
                        refund_desc:refund_desc,
                        refund_addr:refund_addr,
                        refund_time:new Date(),
                    })//直接退货完成
                    if (order.type === 0)  //礼品
                    {
                        const _stock = await this.service.stock.findOne({
                            gift_id: order.gift_id,
                            netspot_id: order.netspot_id,
                            plain: false
                        });
                        await _stock.increment({stock: order._count});

                    } else if (order.type === 1)  //代金券
                    {
                        const voucher = await this.service.voucher.findById(order.voucher_id,{include:['activity']});
                        const is_active = await main.judgeIsActive(voucher);
                        if(is_active.active_or_not)
                        {
                            const _activity = await this.service.activity.findById(voucher.activity_id, {plain: false});
                            await _activity.increment({_count: order._count});
                        }
                        else
                        {
                            const _voucher = await this.service.voucher.findById(order.voucher_id, {plain: false});
                            await _voucher.increment({sum_count: order._count});
                        }

                    } else if (order.type === 2) //商品
                    {
                        const goods = await this.service.goods.findById(order.goods_id,{include:['activity']});
                        const is_active = await main.judgeIsActive(goods);
                        if(is_active.active_or_not)
                        {
                            const _activity = await this.service.activity.findById(goods.activity_id, {plain: false});
                            await _activity.increment({_count: order._count});
                        }
                        else
                        {
                            const _goods = await this.service.goods.findById(order.goods_id, {plain: false});
                            await _goods.increment({sum_count: order._count});
                        }

                    }
                    this.ctx.body={success:true,message:'退货成功！'};
                }
                else
                {
                    try {
                        await this.Service.update(id,{
                            status:-4,
                            refund_reason:refund_reason,
                            refund_phone:refund_phone,
                            refund_desc:refund_desc,
                            refund_addr:refund_addr,
                            refund_time:new Date(),
                        })//
                        order.shop = order.shop||order.netspot;
                        const result = await this.ctx.curl(app.config.bankAPI.refund, {
                            // 必须指定 method
                            method: 'POST',
                            data: {
                                merId: app.config.shopCode,
                                //frontEndUrl: `${opts.protocol}://${opts.hostname}/my/order/${orderId}`,
                                backEndUrl: app.config._host+'/wechat/api/payback',
                                merNo: order.shop.merId,
                                orderNumber: 'TD_' + order.order_no,
                                oriOrderNumber: order.order_no,
                                oriSubOrderNumber: order.order_no,
                                channel: '02',
                                orderAmt: order.amount,
                                orderSendTime: '',
                                logisAmt: 0,
                                comInfoList: JSON.stringify({
                                    comInfo: [{
                                        consumeAmt: 0,
                                        consumeType: '05'
                                    }]
                                })
                                    .replace(/"/g, '\''),
                            },
                            timeout: 30000,
                            dataType: 'json',
                        });
                        console.log('梁怡的测试！')
                        console.log(result)
                        if(result.data!==null&&result.data.message==='success'){

                            if (order.type === 0)  //礼品
                            {
                                const _stock = await this.service.stock.findOne({
                                    gift_id: order.gift_id,
                                    netspot_id: order.netspot_id,
                                    plain: false
                                });
                                await _stock.increment({stock: order._count});

                            } else if (order.type === 1)  //代金券
                            {
                                const voucher = await this.service.voucher.findById(order.voucher_id,{include:['activity']});
                                const is_active = await main.judgeIsActive(voucher);
                                if(is_active.active_or_not)
                                {
                                    const _activity = await this.service.activity.findById(voucher.activity_id, {plain: false});
                                    await _activity.increment({_count: order._count});
                                }
                                else
                                {
                                    const _voucher = await this.service.voucher.findById(order.voucher_id, {plain: false});
                                    await _voucher.increment({sum_count: order._count});
                                }

                            } else if (order.type === 2) //商品
                            {
                                const goods = await this.service.goods.findById(order.goods_id,{include:['activity']});
                                const is_active = await main.judgeIsActive(goods);
                                if(is_active.active_or_not)
                                {
                                    const _activity = await this.service.activity.findById(goods.activity_id, {plain: false});
                                    await _activity.increment({_count: order._count});
                                }
                                else
                                {
                                    const _goods = await this.service.goods.findById(order.goods_id, {plain: false});
                                    await _goods.increment({sum_count: order._count});
                                }

                            }
                            this.ctx.body = {success:true,message:result.data.message};
                        }
                        else
                        {
                            this.ctx.body = {success:false,message:result.data&&result.data.message||'信息异常'};
                        }


                    }
                    catch (err){
                        console.log(err);
                        this.ctx.body={success:false,message:'服务器链接错误！'}
                    }

                }
            }
        }
        async sum() { //结算   //待开发
            const id = this.ctx.params.shopId;
            const sum_time = this.ctx.query.sum_time;
            const pay_time = this.ctx.query.pay_time;
            const result = await this.ctx.curl(app.config.SKAPI + '/integralConver/getIntegralConver', {
                // 必须指定 method
                method: 'GET',
                data: {
                    FKEY: 'USERNAME',
                },
                // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
                dataType: 'json',
            });
            console.log(result)
            if (result.data.flag === true) {
                const info = this.responseJSON(this.service.orders.showShopIndex({
                    id,
                    sum_time,
                    pay_time,
                    score:result.data.data.score,
                }, this.ctx.query));
                return info
               // settle_params.amount = settle_params.real_points/result.data.data.score;
            } else {
                this.ctx.body = {success: false, message: result.data.msg}
            }

            // this.ctx.body={success:true,data:Object.assign(info,{total_points:result.data.data.totalIntegral,exch_points:result.data.data.score})};
        }

        async stat() {
            const info = this.responseJSON(this.service.orders.stat(this.ctx.query));
            return info;
        }
        async amountStat(){
            this.handleOptions();
            // find all
            const list  =await this.Service.findAll(Object.assign(this.ctx.query,{limit:1000000}));
        }
        async create() {
            const values = this.ctx.request.body;
            const user_id = this.ctx.cookies.get('user_id');
            const order_no = (UUID.v1().replace(/-/g, '')).substr(0,11)+(new Date()).getTime();
            values.order_no = order_no;
            if (!values.operator_id) {
                values.operator_id = user_id;
            }
           /* if (!values.pay_time) {
                values.pay_time = new Date();
                values.status = 1;
            }*/
            console.log(123)
            if (values.pay_type == 0 || values.pay_type == 2 && values.exch_points != 0) {
                console.log(1234)
                const customer_type = this.ctx.cookies.get('customer_type') || 1;
                let url = '';
                let params = {
                    FKEY: 'USERNAME',
                    score: values.total_points,
                };
                const _customer = await this.service.customer.findById(values.customer_id);
                if (customer_type == 1) {
                    params.customerCode = _customer.customer_code;
                    url = '/integralDetail/exchangeScore';
                } else if (customer_type == 2) {
                    params.merchantCode = _customer.merchant_code;
                    url = '/merchantIntegralDtl/exchangeScore';
                }
                const result = await this.ctx.curl(app.config.SKAPI + url, {
                    // 必须指定 method
                    method: 'GET',
                    data: params,
                    // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
                    dataType: 'json',
                });
                console.log(result.data)
                // this.ctx.body ={success:true,data:JSON.parse(result.data).data} ;
                if ((result.data).flag === true) {

                    if (values.pay_type == 0) {
                        values.status = 2;
                    }
                    if (values.pay_type == 2) {

                        if(values.amount==0)
                        {
                            values.status = 2;
                        }
                        else
                        {
                            values.status = 0;
                        }
                    }

                    if (values.pay_type == 1) //支付方式为现金时不结算，否则结算状态为待结算
                    {
                        values.sum_status = 0;
                    } else {
                        values.sum_status = 1;
                    }

                    if (values.type == 0)  //礼品
                    {
                        const _stock = await this.service.stock.findOne({
                            gift_id: values.gift_id,
                            netspot_id: values.netspot_id,
                            plain: false
                        });
                        await _stock.decrement({stock: values._count});

                    } else if (values.type == 1)  //代金券
                    {
                        const voucher = await this.service.voucher.findById(values.voucher_id,{include:['activity']});
                        const is_active = await main.judgeIsActive(voucher);
                        if(is_active.active_or_not)
                        {
                            const _activity = await this.service.activity.findById(voucher.activity_id, {plain: false});
                            await _activity.decrement({_count: values._count});
                        }
                        else
                        {
                            const _voucher = await this.service.voucher.findById(values.voucher_id, {plain: false});
                            await _voucher.decrement({sum_count: values._count});
                        }

                    } else if (values.type == 2) //商品
                    {
                        const goods = await this.service.goods.findById(values.goods_id,{include:['activity']});
                        const is_active = await main.judgeIsActive(goods);
                        if(is_active.active_or_not)
                        {
                            const _activity = await this.service.activity.findById(goods.activity_id, {plain: false});
                            await _activity.decrement({_count: values._count});
                        }
                        else
                        {
                            const _goods = await this.service.goods.findById(values.goods_id, {plain: false});
                            await _goods.decrement({sum_count: values._count});
                        }

                    }
                    return super.create(values);
                }
                else {
                    this.ctx.body = {success: false, message: (result.data).msg};
                }

            } else if(values.pay_type == 1&&values.amount==0) {
                values.status=2;
                return super.create(values);
            }else
            {
                return super.create(values);
            }

        }
        async exportExcel() {
            const data = await this.Service.findAll(Object.assign(this.ctx.query,{include:true,limit:1000000}));
            const _data = data.map(item => [
                item.order_no  || '无数据', // 订单号
                {0:'礼品',1:'代金券',2:'商品'}[item.type||0], // 订单类型
                item.netspot&&item.netspot.name||item.shop&&item.shop.name|| '无数据', // 网点/商户
                item.gift&&item.gift.name||item.voucher&&item.voucher.name||item.goods&&item.goods.name || '无数据', // 礼品/代金券/商品
                item._count  || '0', // 数量
                item.total_points  || '0', // 兑换积分
                item.amount  || '0', // 金额支付
                {0:'积分',1:'支付',2:'积分+支付'}[item.pay_type||0], // 支付方式
               /* item.sum_price  || '0', // 结算金额
                item.sum_code  || '无数据', // 结算单号*/
                item.sum_time  || '无数据', // 结算时间
                {0:'支付',1:'待结算',2:'生成结算文件',3:'已结算'}[item.sum_status||0], // 支付方式
                item.customer&& item.customer.name || '无数据', // 结算时间
                item.customer&& item.customer.phone || '无数据', // 结算时间
                item.created_at  || '无数据', // 结算时间
                item.pay_time  || '无数据', // 结算时间
                item.verify_time  || '无数据', // 结算时间

                item.refund_reason  || '无数据', // 结算时间
                item.refund_desc  || '无数据', // 结算时间
                item.refund_phone  || '无数据', // 结算时间
                item.refund_addr  || '无数据', // 结算时间
                item.refund_time  || '无数据', // 结算时间
                {'0':'新建','1':'支付中','2':'支付完成','3':'已核销','-1':'申请退还','-2':'退货失败','-3':'退货成功','-4':'退货中'}[item.status&&item.status.toString()||'0'], // 支付方式
            ]);
            // 加上字段名
            _data.unshift(['订单号', '订单类型', '网点/商户', '礼品/代金券/商品', '数量','兑换积分',
                '金额支付','支付方式','结算时间','结算状态','客户姓名','电话',
                '订单生成时间','支付时间', '核销时间',
                '退货原因','退货描述', '退货电话','退货地址','退货时间','状态'
            ]);
            this.ctx.attachment('report.xls');
            this.ctx.body = xlsx.build([{name: 'orders_report', data: _data}]);
        }
    }

    return OrdersController;
};