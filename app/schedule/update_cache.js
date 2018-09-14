/**
 * Created by 61972 on 2018/2/6.
 */
const Subscription = require('egg').Subscription;

class UpdateCache extends Subscription {
    // 通过 schedule 属性来设置定时任务的执行间隔等配置
    static get schedule() {
        return {
           // interval: '1s', // 1 分钟间隔
            cron:'30 16 18 * * *',
            type: 'worker', // 指定所有的 worker 都需要执行
        };
    }

    // subscribe 是真正定时任务执行时被运行的函数，第一个参数是一个匿名的 Context 实例
    async subscribe() {
        console.log(new Date());
       /* const res = await this.ctx.curl('http://www.api.com/cache', {
            dataType: 'json',
        });
        this.ctx.app.cache = res.data;*/
    }
}

module.exports = UpdateCache;