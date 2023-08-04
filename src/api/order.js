import axios from "../assets/js/request";

// 获取订单列表
export function getOrderList(data){
    return axios({
        type:"get",
        url:'api/getOrderList',
        params:{
            ...data
        }
    })
}

// 修改资源内容
export function deleteOrder(data){
    return axios.post('api/deleteOrder',data)
}
