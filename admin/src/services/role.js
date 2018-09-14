
import func from './publicFunc';
const apiUrl = '/admin/api/roles';


const query = (params)=>{
  return func.query(apiUrl,params);
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

export {query,create,update,del}




