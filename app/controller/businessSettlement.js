//'use strict';
const readline = require('readline');
const fs =require('fs');
const main =require('./main.js');
module.exports = app => {
    class BusinessSettlementController extends app.Controller {
        constructor(ctx) {
            super(ctx, ctx.service.businessSettlement);
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
        async uploadAndSettle(){
            const ctx = this.ctx;
            const _this = this;
            const id = ctx.query.id;
            const stream = await ctx.getFileStream();
            const businessSettlement =await this.Service.findById(id);
            console.log(businessSettlement);
            if(businessSettlement&&businessSettlement.file)
            {
                try {
                   // const path ='app/settlement_file/'+ businessSettlement.file;
                    const rl = readline.createInterface({
                        input: stream,
                        crlfDelay: Infinity
                    });
                    rl.on('line',async (line) => {

                        if(line.indexOf("|")!==-1)
                        {
                            const _line = line.split('|');
                            if(_line[5]==='成功'){
                                const order = await _this.service.orders.findOne({order_no:_line[7]});
                                if(order)
                                {
                                    await _this.service.orders.update(order.id,{sum_status:3})
                                }
                            }
                        }
                    }).on('close',async ()=>{
                        await _this.Service.update(id,{status:1});
                    });
                    this.ctx.body = {success:true,message:'已上传结算文件'};
                }catch (err){
                    this.ctx.body={success:false,err:err,message:'文件上传出错'};
                }

            }
            else
            {
                this.ctx.body={success:false,message:'目标结算文件未找到'};
            }



            // console.log(((stream).ReadableState.buffer))


        }
    }

    return BusinessSettlementController;
};