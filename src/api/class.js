import axios from "../assets/js/request";

// 获取顶级分类
export function getArticleTopClass(data){
    return axios({
        type:"get",
        url:'unapi/articleTopClass',
        params:{
            ...data
        }
    })
}
// 顶级分类下的二级分类
export function getArticleSecondaryClass(data){
    return axios({
        type:"get",
        url:'unapi/articleSecondaryClass',
        params:{
            ...data
        }
    })
}
// 类别分类
export function getArticleSubclass(data){
    return axios({
        type:"get",
        url:'unapi/articleSubclass',
        params:{
            ...data
        }
    })
}
// 获取文章分类
export function getArticleTextClass(data){
    return axios({
        type:"get",
        url:'unapi/articleTextClass',
        params:{
            ...data
        }
    })
}

