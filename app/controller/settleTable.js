//'use strict';
const fs = require('fs');
const path = require('path');
const main =require('./main')
//const streamToString = require('stream-to-string');
module.exports = app => {
    class SettleTableController extends app.Controller {
        constructor(ctx) {
            super(ctx, ctx.service.settleTable);
        }
        async downloadSettlementFile(){

            let str = '';
            str+='124'+'\r\n';
            str+='125'+'\r\n';
            const buffer =  Buffer.from(str);
            const _this = this;
            fs.writeFile(path.join(app.baseDir,'app/settlement_file/index.txt'), str, function (err) {
                 if (err) console.error(err);
                 console.log('数据写入的数据');
                 console.log('-------------------');
             });
        }
        async uploadAndSettle(){
            const ctx = this.ctx;
            const id = ctx.query.id;
            const stream = await ctx.getFileStream();

            const str = await main.streamToSting(stream);

            console.log(str);
            var array = str.split('\r\n');
            console.log(array);
            array.map(function (_array) {
                console.log(_array.split('|'))
            })

            fs.readFile(path.join(app.baseDir,'app/settlement_file/index.txt'), (err, data) => {
                if (err) throw err;
                console.log(data.toString());
            });

           // console.log(((stream).ReadableState.buffer))

            this.ctx.body = 'ok';
        }
        async create (){
            const values = this.ctx.request.body;
            const user_id = this.ctx.cookies.get('user_id');
            if(!values.operator_id)
            {
                values.operator_id = user_id;
            }
            let order_list = [];
            if(values.goods_list)
            {
                const goods_list = values.goods_list.split(',');
                order_list = await this.service.orders.findAll({status:3,pay_time:values.pay_time,limit:10000,goods_id:goods_list,n_sum:1,type:2,pay_type:[0,2]});
            }else if(values.voucher_list)
            {
                const voucher_list = values.voucher_list.split(',');
                order_list = await this.service.orders.findAll({status:3,pay_time:values.pay_time,limit:10000,voucher_id:voucher_list,n_sum:1,type:1,pay_type:[0,2]});
            }
            const settle_params = {
                shop_id:values.shop_id,
                shop_name:values.shop_name,
                total_points:~~values.total_points,
                discount:parseFloat(values.discount),
                real_points:(parseFloat(values.discount)*(~~values.total_points)/10).toFixed(2),
                _count:order_list.length,
            }
            const result = await this.ctx.curl(app.config.SKAPI + '/integralConver/getIntegralConver', {
                // 必须指定 method
                method: 'GET',
                data: {
                    FKEY: 'USERNAME',
                },
                // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
                dataType: 'json',
            });
            if (result.data.flag === true) {
                settle_params.amount = (settle_params.real_points/result.data.data.score)*100;
            } else {
                this.ctx.body = {success: false, message: result.data.msg}
            }



            console.log('张涛测试！');
            console.log(settle_params);
            const settle_table = await this.Service.create(settle_params);
            console.log()
            order_list.map(async (_order)=>{
                await this.service.orders.update(_order.id,{
                    sum_status:3,
                    settle_table_id:settle_table.id,
                    sum_time:new Date(),
                    sum_price:(_order.total_points/result.data.data.score)*parseFloat(values.discount)*10,
                });
            });
            this.ctx.body={success:true,data:settle_table};
          //  return super.create();
        }
        async stat(){
            this.handleOptions();
            // find all
            const list  =await this.Service.findAll(Object.assign(this.ctx.query,{limit:1000000}));
            let amount =0;
            let total_points =0;
            let total_count = 0;
            list.map(_settle=>{
                amount+=_settle.amount;
                total_points+= _settle.total_points;
                total_count+=_settle._count;
            })
            this.ctx.body={
                success:true,
                data:{
                    total_amount:amount,
                    total_points:total_points,
                    total_count:total_count
                }
            }
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
    }

    return SettleTableController;
};