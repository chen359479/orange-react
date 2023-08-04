import axios from "../assets/js/request";

// 根据表名获取资源列表
export function getArticleList(data){
    return axios({
        type:"get",
        url:'unApi/articleList',
        params:{
            ...data
        }
    })
}

// 获取文本列表
export function getArticleTextList(data){
    return axios({
        type:"get",
        url:'unApi/articleTextList',
        params:{
            ...data
        }
    })
}
// 获取资源内容
export function getArticleInfo(data){
    return axios({
        type:"get",
        url:'unApi/articleInfo',
        params:{
            ...data
        }
    })
}
// 修改资源内容
export function updateArticleInfo(data){
    return axios.post('api/updateArticleInfo',data)
}

// 删除资源
export function deleteArticle(data){
    return axios.post('api/deleteArticle',data)
}

// 删除文本
export function deleteArticleText(data){
    return axios.post('api/deleteArticleText',data)
}

// 获取文本内容
export function getArticleTextInfo(data){
    return axios({
        type:"get",
        url:'api/articleTextInfo',
        params:{
            ...data
        }
    })
}

// 新增资源内容
export function addArticleInfo(data) {
    return axios.post('api/addArticleInfo', data)
}

// 新增文本内容
export function addArticleTextInfo(data){
    return axios.post('api/addArticleTextInfo',data)
}

// 修改文本内容
export function updateArticleTextInfo(data){
    return axios.post('api/updateArticleTextInfo',data)
}






