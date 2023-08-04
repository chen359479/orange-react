import axios from "../assets/js/request";

// 获取文件
export function getDocumentList(data){
    return axios({
        type:"get",
        url:'api/documentList',
        params:{
            ...data
        }
    })
}

// 新增文件
export function deleteDocument(data){
    return axios.post('api/deleteDocument',data)
}
