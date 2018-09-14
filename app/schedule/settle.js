/**
 * Created by 61972 on 2018/2/6.
 */
const Subscription = require('egg').Subscription;
const path = require('path');
const fs = require('fs');
class Settle extends Subscription {
    // 通过 schedule 属性来设置定时任务的执行间隔等配置
    static get schedule() {
        return {
          //   interval: '5s', // 1 分钟间隔
            cron:'00 00 01 * * *',
            type: 'worker', // 指定所有的 worker 都需要执行
        };
    }

    // subscribe 是真正定时任务执行时被运行的函数，第一个参数是一个匿名的 Context 实例
    async subscribe() {
        const _params = {
            merId: this.app.config.shopCode,
            history: true,
        }

        const _result = await this.ctx.curl(this.app.config.bankAPI.merchantList+'?merId='+this.app.config.shopCode+'&history='+true, {
            // 必须指定 method
          //  dataAsQueryString:true,
            method: 'GET',
           // data: _params,
            // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
            dataType: 'json',
        });
        const shops =await this.service.shop.findAll({limit:100000,sign_status:0});
        if(_result.data.message==="success")
        {
            shops.map(async (_shop)=>{

                if(_result.data.list.length>0){
                    _result.data.list.map(async (ftp_data)=>{
                        const _ftp_shop = ftp_data.split('|');
                        if(_ftp_shop[2]==='01'&&_ftp_shop[1]===_shop.name&&_ftp_shop[3]==='02')
                        {
                            await this.service.shop.update(_shop.id,{merId:_ftp_shop[0],sign_status:1})
                            console.log('更新商户名称为：'+_shop.name)
                        }
                    })
                }
            })

        }
       // console.log(this.app.config.SKMSGAPI)
    }
}

module.exports = Settle;