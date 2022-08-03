import axios from "../assets/js/request";

export function getMenus(){
    return axios.get('api/getMenus')
}

export function getMenuList(){
    return axios.get('api/getMenuList')
}

export function getCanAddSubset(data){
    return axios({
        type:"get",
        url:'api/getCanAddSubset',
        params:{
            ...data
        }
    })
}

export function deleteMenu(data){
    return axios.post('api/deleteMenu',data)
}

export function updateMenus(data){
    return axios.post('api/updateMenus',data)
}

export function writeMenus(data){
    return axios.post('api/writeMenus',data)
}




