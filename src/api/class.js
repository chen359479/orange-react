import axios from "../assets/js/request";

// 获取分类
export function getTopClass(data){
    return axios({
        type:"get",
        url:'unApi/getTopClass',
        params:{
            ...data
        }
    })
}

// 删除分类
export function deleteClass(data){
    return axios.post('unApi/deleteClass',data)
}

// 新增分类
export function addClass(data){
    return axios.post('unApi/addClass',data)
}

// 修改分类
export function updateClass(data){
    return axios.post('unApi/updateClass',data)
}

// 获取文章分类
export function getArticleTextClass(data){
    return axios({
        type:"get",
        url:'unApi/articleTextClass',
        params:{
            ...data
        }
    })
}

