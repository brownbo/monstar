/**
 * Created by 61972 on 2017/11/8.
 */
const main = require('./main');
const fs = require('fs');
const geohash = require('ngeohash');
module.exports = app => {
    class ShopController extends app.Controller {
        constructor(ctx) {
            super(ctx, ctx.service.shop);
        }
        async test(){
            const a = geohash.neighbors('wm3vuy')
            this.ctx.body={data:a}
        }
        async list(){
            const values = this.ctx.query;
            if(values.lat&&values.long)
            {
                if(values.distance)
                {
                    const _geo_code = geohash.encode(parseFloat(values.lat), parseFloat(values.long));
                    if(values.distance==="40000")
                    {
                        const geoStr = _geo_code.substr(0,4);
                        values.geo_code_array = geohash.neighbors(geoStr) ;
                        values.geo_code_array.push(geoStr);
                    }
                    else if(values.distance==="5000")
                    {
                        const geoStr = _geo_code.substr(0,5);
                        values.geo_code_array = geohash.neighbors(geoStr) ;
                        values.geo_code_array.push(geoStr);
                    }
                    else if(values.distance==="1000")
                    {
                        const geoStr = _geo_code.substr(0,6);
                        values.geo_code_array = geohash.neighbors(geoStr) ;
                        values.geo_code_array.push(geoStr);
                    }
                    else if(values.distance==="160")
                    {
                        const geoStr = _geo_code.substr(0,7);
                        values.geo_code_array = geohash.neighbors(geoStr) ;
                        values.geo_code_array.push(geoStr);
                    }
                    else
                    {
                        console.log(values.distance)
                    }
                }
                this.handleOptions();
                // find all
                const _shops =await this.Service.findAll(values);
                _shops.map((shop)=>{
                    shop.distance = main.getDistance(shop.lat,shop.long,values.lat,values.long)||0;
                })
                // response
                return this.response('list', _shops);


            }
            else
            {
                return super.list();
            }

        }
        async create (){
            const values = this.ctx.request.body;
            const user_id = this.ctx.cookies.get('user_id');
            if(values.lat&&values.long)
            {
                values.geo_code = geohash.encode(parseFloat(values.lat), parseFloat(values.long));
            }
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
            if(values.lat&&values.long)
            {
                values.geo_code = geohash.encode(parseFloat(values.lat), parseFloat(values.long));
            }
            return super.update(values);
        }


    }

    return ShopController;
};