import request from '../utils/request';
exports.query = (apiUrl,params={})=>{
  const url = apiUrl+'?'+exports.urlEncode(exports.compact(params.query?params.query:{}));
  return request(url,{method:'GET'});
}
exports.create = (apiUrl,params={})=> {
  return request(apiUrl, {
    method: 'POST',
    body: params,
  });
}
exports.update = (apiUrl,params={})=> {
  return request(apiUrl+`/${params.id}`,{body:params,method:'PUT'});
}
exports.del = (apiUrl,params={})=>  {
  const url = apiUrl + "?"+exports.getDelParmars(params.idArry);
  return request(url, {method: 'DELETE'});
}

exports.getTableDatas = (apiUrl)=>{
  const url = apiUrl;
  console.log(request(url,{method:'GET'}))
  return request(url,{method:'GET'});
}


/**
 * param 将要转为URL参数字符串的对象
 * key URL参数字符串的前缀
 * encode true/false 是否进行URL编码,默认为true
 * return URL参数字符串
 */
exports.urlEncode = (param, key, encode)=> {
  if (param == null) return '';
  var paramStr = '';
  var t = typeof (param);
  if (t == 'string' || t == 'number' || t == 'boolean') {
    paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param);
  } else {
    for (var i in param) {
      var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
      paramStr += exports.urlEncode(param[i], k, encode);
    }
  }
  return paramStr;
};
exports.compact = (Obj)=>{
  Object.keys(Obj).forEach(key=> {
    if (Obj[key]===undefined||Obj[key]===''||Obj[key]===null) {
      delete Obj[key];
    }
  })
  return Obj;
}

exports.getDelParmars = (idArry)=>{
  let str = '';
  idArry.forEach((item)=>{
    str+='id='+item+"&";
  })
  return str;
}
