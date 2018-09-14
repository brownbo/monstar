
import func from './publicFunc';
const apiUrl = '/admin/api/upload';

const uploadFile = (params)=>{
    let data = new FormData();
    data.append('file',params.data,params.fileName);
    return func.create(apiUrl,{isFile:true,data});
}
export {uploadFile}




