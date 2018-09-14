
/**
 * Created by 郑银华 on 2017/10/25.
 */
import {Select} from 'antd';
const Option = Select.Option;
/**
 * 时间格式化为2017年05月26日格式
 * @param date  Date
 * @returns {string}
 */
exports.getDate_ymd = (date)=> {
  date = new Date(date);
  return date.getFullYear() + '年' + exports.addZero((date.getMonth() + 1)) + "月" + exports.addZero(date.getDate()) + '日';
}

/**
 * 时间格式化为2017-05-07 15:20:00
 * @param date  Date
 * @returns {string}
 */
exports.getDate_ymdhms = (date)=> {
  date = new Date(date);
  return date.getFullYear() + '-' + exports.addZero((date.getMonth() + 1)) + "-" + exports.addZero(date.getDate()) + ' ' + exports.addZero(date.getHours()) + ":" + exports.addZero(date.getMinutes()) + ":" + exports.addZero(date.getSeconds());
}

/**
 * 时间格式化为2017年05月07日 15:20:00
 * @param date  Date
 * @returns {string}
 */
exports.getDate_textymdhms = (date)=> {
  date = new Date(date);
  return date.getFullYear() + '年' + exports.addZero((date.getMonth() + 1)) + "月" + exports.addZero(date.getDate()) + '日 ' + exports.addZero(date.getHours()) + ":" + exports.addZero(date.getMinutes()) + ":" + exports.addZero(date.getSeconds());
}
/**
 * 时间格式化为2017-5-7
 * @param date  Date
 * @returns {string}
 */
exports.getDate_ymdNew = (date)=> {
  date = new Date(date);
  return date.getFullYear() + '-' + exports.addZero((date.getMonth() + 1)) + "-" + exports.addZero(date.getDate());
}
//小于10的数字加0
exports.addZero = (number)=> {
  if (number < 10) {
    return "0" + number.toString()
  }
  return number
}

//更具时间段moment数组，返回:时间戳，时间戳
exports.getTimeStrByMomentArray = (momentArray)=> {
  if(momentArray.length===0)return null;
  const s = new Date(momentArray[0].format('YYYY-MM-DD HH:mm:ss')).getTime();
  const e = new Date(momentArray[1].format('YYYY-MM-DD HH:mm:ss')).getTime();
  return s.toString() + "," + e.toString();
}


/**
 * 根据搜索值和初始值获取下拉列表
 * des:例如根据礼品名称搜索，搜索一个名称后获取search_data，然后生成下拉列表，
 * 如果是编辑动作，没有搜索的下拉列表中没有编辑的礼品这一列，则添加在后面，方便选择
 * @param search_data 搜索结果  array
 * @param default_data 下拉框初始值 array
 * @param isSearchNull 搜索框内容是否为空 bool
 * @param currentObj  如果为编辑，current对象修改之前的对象-关联后获取的对象 object
 * @param id   如果为编辑，current对象此字段修改之前的对象iD - string
 * @returns {Array}
 */

exports.getSelectOptions = (search_data,default_data,isSearchNull,currentObj,id)=> {
  const list = (search_data.length || !isSearchNull) ? search_data : default_data;
  let options = [];
  let haveOptions= false;
  list.forEach((obj)=> {
    if(obj.id===parseInt(id))haveOptions=true;
    options.push(<Option key={obj.id} value={obj.id.toString()}>{obj.name}</Option>);
  })
  if(!haveOptions&&currentObj&&isSearchNull)options.push(<Option key={currentObj.id} value={currentObj.id.toString()}>{currentObj.name}</Option>);
  return options;
}
//审核人下拉特殊定制
exports.getSelectOptionsByVerify = (search_,default_,isSearchNull)=> {
  let options = [];
  [0,1].forEach(i=>{
    const search_obj= search_[i];
    const default_obj = default_[i];
    const list = (search_obj.data.length||!isSearchNull) ? search_obj.data : default_obj.data;
    list.forEach((obj)=> {
      options.push(<Option key={obj.id} value={`${search_obj.type}-${obj.id}`}>{obj.name}</Option>);
    })

  })
  return options;
}


//根据现在时间返回欢迎词
exports.getNowTimeForHeader = ()=> {
  const now = new Date();
  const hour = now.getHours();
  let welcomeText;
  if (hour < 6) {
    welcomeText = "凌晨好!"
  }
  else if (hour < 9) {
    welcomeText = "早上好！"
  }
  else if (hour < 12) {
    welcomeText = "上午好！"
  }
  else if (hour < 14) {
    welcomeText = "中午好！"
  }
  else if (hour < 17) {
    welcomeText = "下午好！"
  }
  else if (hour < 19) {
    welcomeText = "傍晚好！"
  }
  else if (hour < 24) {
    welcomeText = "晚上好！"
  }

  const dayNames = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
  const Stamp = new Date();
  const timeStr = exports.getDate_textymdhms(Stamp) + ' ' + dayNames[Stamp.getDay()];
  return [welcomeText, timeStr]
}

//
exports.getMenuKeyByObj = (obj)=> {
  const array =  Object.keys(obj).map(item=>{
    return [item].concat(obj[item])
  })
  if(!array.length) return array;
  const a = array.reduce((total,item)=>{
    return total.concat(item)
  })
  return a;
}

//价格分转换为元
exports.price = (price)=> {
  if(!price){
    return 0;
  }else{
    return (price/100).toFixed(2);
  }
}


exports.readBlobAsDataURL = (blob, callback)=> {
  var a = new FileReader();
  a.onload = function(e) {callback(e.target.result);};
  a.readAsDataURL(blob);
}


