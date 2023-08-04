import axios from "../assets/js/request";

export function login(data){
    return axios.post('unApi/login',data)
}

export function register(data){
    return axios.post('api/register',data)
}

export function getUserList(data){
    return axios({
        type:"get",
        url:'api/userList',
        params:{
            ...data
        }
    })
}

export function updateUserPassword(data){
    return axios.post('api/updateUserPassword',data)
}

export function deleteUser(data){
    return axios.post('api/deleteUser',data)
}

export function updateUser(data){
    return axios.post('api/updateUser',data)
}

export function updateMePassword(data){
    return axios.post('api/updateMePassword',data)
}







