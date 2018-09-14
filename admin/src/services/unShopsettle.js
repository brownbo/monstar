
import func from './publicFunc';
const apiUrl = '/admin/api/settles';
const apiUr = '/admin/api/orders';

const query = (params)=>{
  return func.query(apiUr,params);
}
const create = (params)=>{
  return func.create(apiUrl,params);
}
const update = (params)=>{
  return func.update(apiUrl,params);
}
const del = (params)=>{
  return func.del(apiUrl,params);
}
const queryOrder = (params)=>{
  return func.query(apiUr,params);
}

export {query,create,update,del,queryOrder}




