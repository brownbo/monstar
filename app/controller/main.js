/**
 * Created by 61972 on 2017/12/7.
 */
module.exports.unique=function(_str){
    const newArr = _str.split(',');
   // let newArr = str.concat();
    newArr.sort();
    for (let i = newArr.length; i > 0; i--) {
        if ( newArr[i] === newArr[ i - 1 ] ) { // use == if '2' eq 2, else ===
            newArr.splice( i, 1 );
        }
    }
    return newArr;
}
exports.judgeTime = function (type,_dasOfWeek,startAt,endAt) {
    console.log(type)
    const dasOfWeek = _dasOfWeek.split(',');
    console.log(dasOfWeek)
    console.log(startAt)
    console.log(endAt)
    const day = new Date();
    if (startAt && endAt) {
        if (day < new Date(startAt) || day > new Date(endAt)) {
            return false
        }
    }


    if (type == '0')  //日
    {
        console.log('当前是日类型')
        const week = day.getDate().toString();
        console.log('当前日期'+week)
        if (dasOfWeek && dasOfWeek[0] !== '' && dasOfWeek !== []) {
            if (dasOfWeek.indexOf(week) === -1) {
                return false;
            }
            else {

                return true;
            }
        }
    } else if (type == '1') { //周

        console.log('当前是周类型')
        const week = day.getDay().toString();
        console.log('当前周' + week);
        if (dasOfWeek && dasOfWeek[0] !== '' && dasOfWeek !== []) {
            if (dasOfWeek.indexOf(week) === -1) {
                return false;
            }
            else {
                return true;
            }
        }
    } else if (type == '2') { //月
        console.log('当前是月类型')
        const week = day.getMonth().toString();
        if (dasOfWeek && dasOfWeek[0] !== '' && dasOfWeek !== []) {
            if (dasOfWeek.indexOf(week) === -1) {
                return false;
            }
            else {
                return true;
            }
        }
    } else if (type == '3') { //年
        console.log('当前是年类型')
        const week = day.getFullYear().toString();
        if (dasOfWeek && dasOfWeek[0] !== '' && dasOfWeek !== []) {
            if (dasOfWeek.indexOf(week) === -1) {
                return false;
            }
            else {
                return true;
            }
        }
    } else {
        console.log('当前是无判断')
        return true;
    }

};
module.exports.reduceCount=async function (_this,type,id,count,netspot_id) {
    if(type===0)  //礼品
    {
        const _stock = await _this.service.stock.findOne({gift_id:id,netspot_id:netspot_id});
        return _stock.decrement({stock:count});

    }else if(type===1)  //代金券
    {
        const _voucher =await _this.service.voucher.findById(id,{plain:false});
        return _voucher.decrement({sum_count:count});
    }else if(type===2) //商品
    {
        const _goods =await _this.service.goods.findById(id,{plain:false});
        return _goods.decrement({sum_count:count});
    }
}
module.exports.judgeGiftIsCanBuy=async function (_this,goods_id) {

    const goods = await _this.Service.findById(goods_id,{include:['activity']});
    // const user_id = await _this.service.goods.findById(user_id,{include:['activity']});
    const start_at=goods.activity&&goods.activity.start_at||'';
    const end_at=goods.activity&&goods.activity.end_at||'';
    const active_days=goods.activity&&goods.activity.active_days||'';;
    const time_type=goods.activity&&goods.activity.time_type||0;
    const is_active=goods.is_active;
    // const isActive=Boolean(goods[0].get('isActive'));
    let active_or_not = false;
    let stock = 0;
    let sum_count = 0;
    const stocks = await _this.service.stock.findAll({gift_id:goods_id});
    stocks.map(function (_stock) {
        sum_count += _stock.stock;
    });
    if(is_active)
    {
        const is_inactive=this.judgeTime(time_type,active_days,start_at,end_at);
        /*if(is_active&&is_inactive)
        {
            stock = goods.activity&&goods.activity._count||0

        }
        else
        {
            stock = sum_count||0;
        }*/
        active_or_not = is_inactive;
        /* if(is_inactive)
         {
         stock = goods.activity&&goods.activity._count||0
         }*/
        if(!is_inactive)
        {
            sum_count = 0;
        }
        console.log(is_inactive+'活动范围内');
    }
    else
    {
      //  stock = goods.sum_count||0;
        console.log('没有做活动');
    }
    return {
        stock:sum_count,
        active_or_not:active_or_not,
    }
}



module.exports.judgeIsActive=async function (goods) {

   // const goods = await _this.service.findById(goods_id,{include:['activity']});
    // const user_id = await _this.service.goods.findById(user_id,{include:['activity']});
    const start_at=goods.activity&&goods.activity.start_at||'';
    const end_at=goods.activity&&goods.activity.end_at||'';
    const active_days=goods.activity&&goods.activity.active_days||'';;
    const time_type=goods.activity&&goods.activity.time_type||0;
    const is_active=goods.is_active;
    // const isActive=Boolean(goods[0].get('isActive'));
    let active_or_not = false;
    let stock = 0;

    if(is_active)
    {
        const is_inactive=this.judgeTime(time_type,active_days,start_at,end_at);
        console.log(is_inactive+'活动范围内');
        active_or_not = is_inactive;
    }
    else
    {
        stock = goods.sum_count||0;
        console.log('没有做活动');
    }
    return {
        stock:stock,
        active_or_not:active_or_not,
    }
}

module.exports.judgeIsCanBuy=async function (_this,goods_id) {

    const goods = await _this.Service.findById(goods_id,{include:['activity']});
   // const user_id = await _this.service.goods.findById(user_id,{include:['activity']});
    const start_at=goods.activity&&goods.activity.start_at||'';
    const end_at=goods.activity&&goods.activity.end_at||'';
    const active_days=goods.activity&&goods.activity.active_days||'';;
    const time_type=goods.activity&&goods.activity.time_type||0;
    const is_active=goods.is_active;
   // const isActive=Boolean(goods[0].get('isActive'));
    let active_or_not = false;
    let stock = 0;

    if(is_active)
    {
        const is_inactive=this.judgeTime(time_type,active_days,start_at,end_at);
        if(is_active&&is_inactive)
        {
            stock = goods.activity&&goods.activity._count||0

        }
        else
        {
            stock = 0;
        }
        active_or_not = is_inactive;
       /* if(is_inactive)
        {
            stock = goods.activity&&goods.activity._count||0
        }*/

        console.log(is_inactive+'活动范围内');
    }
    else
    {
        stock = goods.sum_count||0;
        console.log('没有做活动');
    }
    return {
        stock:stock,
        active_or_not:active_or_not,
    }
}
exports.checkSignature = function (model, body) {
    console.log('校验签名中...')
    return new Promise((resolve, reject) => {
        request.post({
            url: requestUrl.signature,
            timeout: 10000,
            form: {
                merId: config.shopCode,
                model: model,
                respString: body
            }
        }, function (err, res, body) {
            if (err) {
                return reject(err);
            }
            console.log('签名校验结果', body);
            body = JSON.parse(body);
            if (body.message === 'success' && body.result.toString() === 'true') {
                resolve(body);
            } else {
                reject(new Error(body.message));
            }
        });
    });
}

exports.payOrRefund = function (opts) {
    console.log('收到后台通知', opts);
    // 支付成功
    if (~~opts.transType === 1 && ~~opts.respCode === 0 && ~~opts.payStatus === 2) {
        // 校验签名
        exports.checkSignature('01', querystring.stringify(opts))
            .then(_ => {
                console.log('签名校验通过');
                console.log('查询订单中...')
                const query = new AV.Query('Orders');
                return query.get(opts.orderNumber);
            })
            .then(order => {
                const status = order.get('status');
                if (status !== 0 && status !== 1) {
                    return AV.Promise.error('原订单 ' + order.id + ' 状态为: ' + status + ', 支付通知被忽略');
                }
                order.set('status', 2);
                order.set('payType', ~~opts.payType);
                order.set('expiredAt', MAX_EXPIRED_DAY);
                order.set('payTime', new Date(
                    ~~opts.orderSendTime.slice(0, 4),
                    ~~opts.orderSendTime.slice(4, 6) - 1,
                    ~~opts.orderSendTime.slice(6, 8),
                    ~~opts.orderSendTime.slice(8, 10),
                    ~~opts.orderSendTime.slice(10, 12),
                    ~~opts.orderSendTime.slice(12, 14)));
                return order.save();
            })
            .then(order => {
                // 支付完成更新库存
                // 配送订单发送短信通知
                /*if (order.get('orderType') === 1) {
                    exports.sendMsg(order);
                }*/
            })
            .catch(err => console.error(err.message));
    }
    // 退货
    else if (~~opts.transType === 2) {
        // 校验签名
        exports.checkSignature('02', querystring.stringify(opts))
            .then(_ => {
                console.log('签名校验通过');
                console.log('查询订单中...')
                const query = new AV.Query('Orders');
                return query.get(opts.oriOrderNumber)
            })
            .then(order => {
                const status = order.get('status');
                if (status === -1 || status === -4) {
                    order.set('status', -3);
                    return order.save();
                }
                return AV.Promise.error('原订单 ' + order.id + ' 状态为: ' + status + ', 退货通知被忽略');
            }).then(order => {
            // 退货完成更新库存
          //  exports.updateGoodsStock(order.get('goods').id, -order.get('number'));
        })
            .catch(err => console.error(err.message));
    }
};

exports.streamToSting = function (stream, enc, cb) {
    if (typeof enc === 'function') {
        cb = enc
        enc = null
    }
    cb = cb || function () {}

    let str = ''

    return new Promise (function (resolve, reject) {
        stream.on('data', function (data) {
            str += (typeof enc === 'string') ? data.toString(enc) : data.toString()
        })
        stream.on('end', function () {
            resolve(str)
            cb(null, str)
        })
        stream.on('error', function (err) {
            reject(err)
            cb(err)
        })
    })
}
/*
exports.pickFromObject = function (protoObj) {
    protoObj.map(function (_obj, _index) {
        let a = {};
        let b = {};
        if(typeof _obj[_index] ==='object')
        {

        }
    })
}*/
const EARTH_RADIUS = 6378137.0;    //单位M
const PI = Math.PI;
exports.getRad=function(d){
    return d*PI/180.0;
}
exports.getDistance =function (lat1,lng1,lat2,lng2){
    lat1 = parseFloat(lat1);
    lng1 = parseFloat(lng1);
    lat2 = parseFloat(lat2);
    lng2 = parseFloat(lng2);
    const f = this.getRad((lat1 + lat2)/2);

    const g = this.getRad((lat1 - lat2)/2);

    const l = this.getRad((lng1 - lng2)/2);



    let sg = Math.sin(g);

    let sl = Math.sin(l);

    let sf = Math.sin(f);



    let s,c,w,r,d,h1,h2;

    const a = EARTH_RADIUS;

    const fl = 1/298.257;



    sg = sg*sg;

    sl = sl*sl;

    sf = sf*sf;



    s = sg*(1-sl) + (1-sf)*sl;

    c = (1-sg)*(1-sl) + sf*sl;



    w = Math.atan(Math.sqrt(s/c));

    r = Math.sqrt(s*c)/w;

    d = 2*w*a;

    h1 = (3*r -1)/2/c;

    h2 = (3*r +1)/2/s;

    console.log(d*(1 + fl*(h1*sf*(1-sg) - h2*(1-sf)*sg)))

    return d*(1 + fl*(h1*sf*(1-sg) - h2*(1-sf)*sg));

}