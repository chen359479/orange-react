import { message ,  } from 'antd';
import {  ExclamationCircleOutlined } from '@ant-design/icons';

// 搜索字段
export const search = {
    payStatus:0,
    orderID:"",
    title:"",
    userPhone:"",
    username:"",
    grade:0,
    classID:1,
    state:0,
    type:2,
    motorcycle:'',
    plateNumber:'',
    name:'',
    phone:'',
    pageSize:10,
    page:1,
}

// 操作提示
export const  confirmMsg = {
    icon: <ExclamationCircleOutlined />,
    content: '此操作不可逆，请谨慎操作！',
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
}

// 状态列表
export const statusList = [
    {
        label:'全部',
        value: 2
    },{
        label: "上架",
        value: 1
    },{
        label: "下架",
        value: 0
    }
]

// 付款状态
export const payStateList =  [
    {
        value: 0,
        label: '全部'
    },{
        value: 1,
        label: '已付款'
    },{
        value: 2,
        label: '未付款'
    },
]

// 广播消息等级
export const gradeTypeList = [
    {
        value: 0,
        label: '全部'
    },{
        value: 1,
        label: '高'
    },{
        value: 2,
        label: '中'
    },{
        value: 3,
        label: '低'
    }
]

// 文件上传处理
export function uploadFileDispose(data){
    return JSON.stringify(
        data.map(item=>{
            // 判断是否包含response，如果包含则为新上传的文件
            if(item.response){
                return {
                    ...item.response,
                    uid : item.uid,
                    name: item.name,
                    status: 'done',
                    url: item.response.src
                }
            }else {
                return item
            }
        })
    )
}

// 文件上传处理
export function beforeUpload4MB(file){
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 4;
    if (!isLt2M) {
        message.error('Image must smaller than 4MB!');
    }
    return isJpgOrPng && isLt2M;
}

// 判断文件上传类型
export function videoBeforeUpload(file){
    const isMP4 = file.type === 'mp4';
    if (!isMP4) {
        message.error('只能上传mp4视频')
        return false
    }
    return isMP4
}

// 文件normFile
export function normFile(e) {
    if (Array.isArray(e)) {
        return e;
    }
    return e && e.fileList;
}

// 计算剩余天数
export function calculateRemainingDays( startTime , endTime){
    // 获取开始日期
    let startDate = new Date( startTime );
    // 将目标日期转换为日期对象
    let endDate = new Date( endTime );
    // 计算剩余天数
    let timeDiff = endDate.getTime() - startDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

