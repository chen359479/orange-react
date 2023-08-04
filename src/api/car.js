import axios from "../assets/js/request";

// 获取车辆订单
export function getCarOrders(data){
    return axios({
        type:"get",
        url:'api/carOrders',
        params:{
            ...data
        }
    })
}

// 获取车辆订单信息
export function getCarOrderInfo(data){
    return axios({
        type:"get",
        url:'api/getCarOrderInfo',
        params:{
            ...data
        }
    })
}

// 删除订单
export function deleteCarOrder(data){
    return axios.post('api/deleteCarOrder',data)
}

// 新增订单
export function addCarOrder(data){
    return axios.post('api/addCarOrder',data)
}

// 新增订单
export function updateCarOrder(data){
    return axios.post('api/updateCarOrder',data)
}


// 获取车辆列表
export function getCarList(data){
    return axios({
        type:"get",
        url:'api/getCarList',
        params:{
            ...data
        }
    })
}

// 获取车辆信息
export function getCarInfo(data){
    return axios({
        type:"get",
        url:'api/getCarInfo',
        params:{
            ...data
        }
    })
}

// 获取车辆信息
export function getCarInfoPn(data){
    return axios({
        type:"get",
        url:'api/getCarInfoPn',
        params:{
            ...data
        }
    })
}

// 新增车辆信息
export function addCarInfo(data){
    return axios.post('api/addCarInfo',data)
}

// 更新车辆信息
export function updateCarInfo(data){
    return axios.post('api/updateCarInfo',data)
}

// 删除车辆
export function deleteCarInfo(data){
    return axios.post('api/deleteCarInfo',data)
}

// 上架/下架车辆
export function updateCarStatus(data){
    return axios.post('api/updateCarStatus',data)
}


