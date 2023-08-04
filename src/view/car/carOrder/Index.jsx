import { useState , useEffect } from 'react';

import {Button, message, Modal, Descriptions , Image } from "antd";
import {  DeleteOutlined , PlusOutlined } from '@ant-design/icons';

import MyContext from "@/component/MyContext/MyContext";
import UpdateCar from "./UpdateCar";
import SearchBox from "@/component/SearchBox/Index";
import TableBox from "@/component/TableBox/Index";

import { getCarOrders as getCarOrdersApi , deleteCarOrder as deleteCarsApi } from "@/api/car";
import { calculateRemainingDays , search , confirmMsg } from '@/assets/js/public';

const { confirm } = Modal;

export default ()=> {

    const [ searchForm , setSearchForm ] = useState(search);
    const [ total , setTotal ] = useState(0);
    const [ carList , setCarList ] = useState([]);
    const [ activeList , setActiveList ] = useState([]);
    const [ editForm , setEditForm ] = useState({
        switch:false,
        id:0
    });

    const [ columns ] = useState([
        {
            title: '用户姓名',
            dataIndex: 'name',
            align:'center',
        },{
            title: '用户手机号',
            dataIndex: 'phone',
            align:'center',
        },{
            title: '车牌号',
            dataIndex: 'plate_number',
            align:'center',
        },
        {
            title: '车型',
            dataIndex: 'motorcycle',
            align:'center',
        },
        {
            title: '状态',
            key: 'status',
            render: (_, record) =>{
                let end_time =  new Date(record.end_time).getTime();
                let new_time =  new Date().getTime();
                let state = (end_time - new_time )/1000/60/60;
                let stateStyle = {}
                switch(state){
                    case state > 8:
                        stateStyle = { color: "#52c41a" , title : '使用中' };
                        break
                    case state > 0:
                        stateStyle = { color: "#ff4d4f" , title : '临期' };
                        break
                    default:
                        stateStyle = { color: "#ccc" , title : '已完成' };
                }
                return ( <span style={{ color : stateStyle.color }}> { stateStyle.title } </span> )
            },
            align:'center',
        },{
            title: '金额',
            dataIndex: 'money',
            align:'center',
        },{
            title: '操作',
            align:'center',
            width:160,
            render:(_,row)=>{
                return (
                    <div>
                        <Button type="link" onClick={ ()=>addCarOrder( true , row.id ) }>编辑</Button>
                        <Button type="link" danger onClick={ _=>deleteList(row.id) }>删除</Button>
                    </div>
                )
            }
        },

    ])

    // 扩展信息
    const expandedRowRender = (row) => {
        return (
            <Descriptions title="详细信息" bordered size='small'>
                <Descriptions.Item label="身份证号">{ row.idNumber }</Descriptions.Item>
                <Descriptions.Item label="押金">{ row.guarantee_deposit }元</Descriptions.Item>
                <Descriptions.Item label="行驶里程">{ row.mileage || 0 }km</Descriptions.Item>
                <Descriptions.Item label="租车开始时间">{ row.start_time }</Descriptions.Item>
                <Descriptions.Item label="租车结束时间">{ row.end_time }</Descriptions.Item>
                <Descriptions.Item label="租车时长">{ calculateRemainingDays( row.start_time , row.end_time ) }天</Descriptions.Item>
                <Descriptions.Item label="车辆图片" span={3}>
                    {
                        JSON.parse(row.imgs).map(item=>{
                            return (
                                <Image width={100}  height={100} key={ item.url } src={ item.url }/>
                            )
                        })
                    }
                </Descriptions.Item>
                <Descriptions.Item label="订单备注" span={3}>{ row.other }</Descriptions.Item>
            </Descriptions>
        )
    };

    // 获取订单列表
    let getCarOrders = ()=>{
        getCarOrdersApi( searchForm ).then(res=>{
            setCarList(res.data)
            setTotal(res.total)
        })
    }

    // 删除订单列表
    let deleteList = (id)=>{
        confirm({
            title: `确定删除${ id?'此':'这些' }订单吗?`,
            ...confirmMsg,
            onOk() {
                id = id?id:activeList.map(item =>item.id);
                deleteCarsApi({ id }).then(res=>{
                    message.success(res.msg);
                    getCarOrders()
                })
            },
        });
    }

    // 新增/编辑订单
    let addCarOrder  = ( val ,id )=>{
        setEditForm({
            switch : val,
            id
        })
    }

    const startArr = [
        {
            name :'name',
            label:'姓名',
            type:'input'
        },{
            name :'phone',
            label:'电话',
            type:'input'
        }
    ]

    const endArr = [
        <Button htmlType="button" icon={<PlusOutlined />} onClick={ _=>addCarOrder( true , '' ) }>新增订单</Button>,
        <Button danger disabled={ 0 >= activeList.length  }  icon={<DeleteOutlined />} onClick={ _=>deleteList() } > 批量删除 </Button>
    ]

    useEffect(()=>{
        getCarOrders()
    },[ searchForm ])

    return (
        <div>
            {
                editForm.switch?
                    <MyContext.Provider value={{
                        editForm,
                        closeEdit : () =>{ setEditForm({ ...editForm , switch :false }); getCarOrders() }
                    }}>
                        <UpdateCar />
                    </MyContext.Provider>
                    :
                    <SearchBox startArr={ startArr } endArr={endArr} searchForm={ searchForm } setSearchForm={ setSearchForm }/>
            }

            <TableBox show={ editForm.switch } columns={ columns } activeList={ activeList } setActiveList={ setActiveList }
                      dataSource={ carList } searchForm={searchForm} total={total} setSearchForm={setSearchForm} expandable={ expandedRowRender }/>

        </div>
    )
}
