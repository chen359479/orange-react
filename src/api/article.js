import axios from "../assets/js/request";

// 根据表名获取资源列表
export function getArticleList(data){
    return axios({
        type:"get",
        url:'unapi/articleList',
        params:{
            ...data
        }
    })
}
// 获取文本列表
export function getArticleTextList(data){
    return axios({
        type:"get",
        url:'unapi/articleTextList',
        params:{
            ...data
        }
    })
}
// 获取资源内容
export function getArticleInfo(data){
    return axios({
        type:"get",
        url:'unapi/articleInfo',
        params:{
            ...data
        }
    })
}
// 修改资源内容
export function updateArticleInfo(data){
    return axios.post('api/updateArticleInfo',data)
}
// 修改文本内容
export function updateArticleTextInfo(data){
    return axios.post('api/updateArticleTextInfo',data)
}
// 删除资源和文本
export function deleteArticle(data){
    return axios.post('api/deleteArticle',data)
}








