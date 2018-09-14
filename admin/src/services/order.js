
import func from './publicFunc';
const apiUrl = '/admin/api/orders';
const api_files = '/admin/api/ordersToExcel';


const query = (params)=>{
  return func.query(apiUrl,params);
}
const getFiles = (params)=>{
  return func.query(api_files,params);
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

export {query,getFiles,create,update,del}




