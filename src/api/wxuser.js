import axios from "../assets/js/request";

// 获取微信用户
export function getWxuserList(data){
    return axios({
        type:"get",
        url:'api/getWxuserList',
        params:{
            ...data
        }
    })
}
// 删除微信用户
export function deleteWxuser(data){
    return axios.post('api/deleteWxuser',data)
}
