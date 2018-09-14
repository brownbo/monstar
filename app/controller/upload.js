/**
 * Created by 61972 on 2017/11/15.
 */
const path = require('path');
const sendToWormhole = require('stream-wormhole');
const fs = require('fs');
module.exports = app => {
    class UploaderController extends app.Controller {
        async upload(){
            const ctx = this.ctx;
            const stream = await ctx.getFileStream();
            var dataStr = (new Date()).getTime() + path.extname(stream.filename);
            const name =path.join(app.baseDir,'/app/upload/')  + dataStr;
            // 文件处理，上传到云存储等等
            const promise = new Promise(function(resolve, reject) {
                stream.pipe(fs.createWriteStream(name)).on('close',function (err) {
                    if (err){
                        reject(err);
                    } else {
                        resolve(1);
                    }
                });

            });
            await Promise.all([promise]).then(function () {
                ctx.body = {
                    success:true,
                    url: '/static/'  + dataStr,
                    // 所有表单字段都能通过 `stream.fields` 获取到
                };
            }).catch(function (err,_err) {
                ctx.body = {
                    success:false,
                    message:err,
                };
            })
        }
    }

    return UploaderController;
};