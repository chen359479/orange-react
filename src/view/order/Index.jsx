import { useState , useEffect } from 'react';
import {Button,  message, Modal } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

import { getOrderList as getOrderListApi , deleteOrder as deleteOrderApi } from '@/api/order';
import { confirmMsg , search , payStateList } from '@/assets/js/public';

import SearchBox from "@/component/SearchBox/Index";
import TableBox from "@/component/TableBox/Index";

const { confirm } = Modal;

export default  ()=> {
    const [ searchForm , setSearchForm ] = useState(search);

    const [ columns ] = useState([
        {
            title: '订单编号',
            dataIndex: 'orderID',
            align:'center',
        },{
            title: '订单名称',
            dataIndex: 'title',
            align:'center',
        },{
            title: '用户名称',
            dataIndex: 'userName',
            align:'center',
        },{
            title: '用户手机号',
            dataIndex: 'userPhone',
            align:'center',
        },{
            title: '订单创建时间',
            dataIndex: 'created_time',
            align:'center',
        },{
            title: '状态',
            dataIndex: 'state',
            render: text =>{
                let state = Number(text);
                let stateStyle = {};
                switch(state){
                    case 1:
                        stateStyle = { color: "#52c41a" };
                        break
                    case 2:
                        stateStyle = { color: "#faad14" };
                        break
                    case 3:
                        stateStyle = { color: "#ff4d4f" };
                        break
                }
                return ( <span style={stateStyle}> { payStateList.filter(item=>Number(item.value) === state)[0].label} </span> )
            },
            align:'center',
        }
    ])

    const [ total , setTotal ] = useState(0);
    const [ payList , setPayList ] = useState([]);
    const [ activePays , setActivePays ] = useState([]);

    // 获取订单列表
    let getOrderList = ()=>{
        getOrderListApi(searchForm).then(res=>{
            setPayList(res.data);
            setTotal(res.total)
        })
    }

    // 删除订单列表
    let deletePays = ()=>{
        confirm({
            title: `确定删除这些订单吗?`,
            ...confirmMsg,
            onOk() {
                let id = activePays.map(item =>item.id)
                deleteOrderApi({ id }).then(res=>{
                    message.success(res.msg);
                    getOrderList()
                })
            },
        });
    }

    const startArr = [
        {
            name :'payStatus',
            label:'状态',
            type:'option',
            selectData:payStateList
        },{
            name :'orderID',
            label:'订单号',
            type:'input'
        },{
            name :'phone',
            label:'手机号',
            type:'input'
        },{
            name :'title',
            label:'订单名称',
            type:'input'
        }
    ]

    const endArr = [
        <Button danger disabled={ 0 >= activePays.length  }  icon={<DeleteOutlined />} onClick={ deletePays } > 批量删除 </Button>
    ]

    useEffect(()=>{
        getOrderList()
    },[ searchForm ])

    return (
        <div>
            <SearchBox startArr={ startArr } endArr={endArr} searchForm={ searchForm } setSearchForm={ setSearchForm }/>
            <TableBox columns={ columns } activeList={ activePays } setActiveList={ setActivePays }
                      dataSource={ payList } searchForm={searchForm} total={total} setSearchForm={setSearchForm}/>
        </div>
    )
}
