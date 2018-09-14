import fetch from 'dva/fetch';
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}
/**
 * fetch
 * @param url
 * @param opts
 * @param opts.retry 重试次数
 * @return {Promise<any>}
 */
export  default async function request(url, opts = {}) {
  console.log('url',url);
  let isFile;
  if(['POST','PUT'].includes(opts.method)){
    if(!opts.body.isFile){//如果是文件上传 不需要设置content-type 参考网址:https://segmentfault.com/a/1190000010205162
      opts.body = JSON.stringify(opts.body);
      opts.headers = {'Content-Type':'application/json'};
    }else{
      isFile = true;
      opts.body = opts.body.data;
    }
  }
  opts.credentials = 'include';
  const response = await fetch(url, opts);
  checkStatus(response);
  const result = await response.json();
  if (result.success||result.message==='未登录'){
    if(isFile){
      return result.url;
    }else{
      return result.data;
    }
  }
  
  throw new Error(result.message);
}

