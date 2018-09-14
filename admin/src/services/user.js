
import func from './publicFunc';
const apiUrl = '/admin/api/users';


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
/**
 * 修改密码
 * 
 * @param {any} params 
 * @returns 
 */
const updatePassword = (params)=>{
  return func.update('/admin/api/changePass',params);
}
export {query,create,update,del,updatePassword}




