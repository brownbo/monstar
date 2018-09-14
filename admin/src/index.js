import dva from 'dva';
import { message } from 'antd'
import createLoading from 'dva-loading'
import './index.css';


// 1. Initialize
const app = dva({
  onError (error) {
    console.log(error);
    message.error(error.message)
  },
});

// 2. Plugins
app.use(createLoading());
// app.use({});

// 3. Model
app.model(require('./models/login'));
app.model(require('./models/app'));
app.model(require('./models/area'));
app.model(require('./models/netspot'));
app.model(require('./models/notification'));
app.model(require('./models/shop'));
app.model(require('./models/shop_type'));
app.model(require('./models/shop_interval'));
app.model(require('./models/shop_settlement'));
app.model(require('./models/shopsettleTable'));
app.model(require('./models/unShopsettle'));
app.model(require('./models/voucher'));
app.model(require('./models/goods'));
app.model(require('./models/gift_type'));
app.model(require('./models/gift'));
app.model(require('./models/gift_sign'));

app.model(require('./models/evalGoods'));
app.model(require('./models/businessRecommend'));
app.model(require('./models/evalGifts'));

app.model(require('./models/stock'));
app.model(require('./models/stockRec'));
app.model(require('./models/examine'));


app.model(require('./models/banner'));
app.model(require('./models/customer'));
app.model(require('./models/user'));
app.model(require('./models/role'));
app.model(require('./models/order'));
app.model(require('./models/staff'));
app.model(require('./models/merchant'));
// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
