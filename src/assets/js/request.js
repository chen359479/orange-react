import axios from 'axios'
import { message } from 'antd';
import userInfo from "./userInfo";
import PubSub from 'pubsub-js';

let request = axios.create({
    baseURL:'http://123.249.91.200:8199/',
    timeout:10000
})
//拦截请求
request.interceptors.request.use((config)=>{
    config.headers.authorization = userInfo.token;
    return config
})

//拦截响应
request.interceptors.response.use((response)=>{

        if(response.data.code === 200){
            return response.data
        }else if (response.data && !response.data.status && response.data.code === 401) {
            PubSub.publish('logout');
            message.error(response.data.msg)
            return { }
        }else if(response.data.code === 400 || response.data.code === 404){
            message.error(response.data.msg);
            return response.data
        }else if(response.data.code === 500){
            message.error(response.data.msg);
            new Error()
        }
    },function (error){

        message.error(error.message)
        //对响应的错误做点什么
        return Promise.reject(error);
    }
)

export default request
