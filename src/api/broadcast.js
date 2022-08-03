import axios from "../assets/js/request";

export function getBroadcastList(data){
    return axios({
        type:"get",
        url:'api/broadcastList',
        params:{
            ...data
        }
    })
}

export function getBroadcastInfo(id){
    return axios({
        type:"get",
        url:'api/getBroadcastInfo',
        params:{
            id
        }
    })
}

export function writeBroadcast(data){
    return axios.post('api/writeBroadcast',data)
}

export function deleteBroadcast(data){
    return axios.post('api/deleteBroadcast',data)
}


