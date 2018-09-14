
import func from './publicFunc';


const login = (params)=>{
  return func.create('/api/login',params);
}
const getCurrent = (params)=>{
  return func.query('/admin/api/getCurrent');
}

const logout = (params)=>{
  return func.create('/admin/api/logout',params);
}

export {login,getCurrent,logout,}




