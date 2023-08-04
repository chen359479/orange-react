import { useState , useEffect } from 'react';

import {Button, message, Modal,  Descriptions , Image  } from "antd";
import {  DeleteOutlined , ExclamationCircleOutlined , PlusOutlined  } from '@ant-design/icons';

import {
    getCarList as getCarListApi,
    deleteCarInfo as deleteCarInfoApi,
    updateCarStatus as updateCarStatusApi
} from "@/api/car";

import { calculateRemainingDays , search } from '@/assets/js/public';

import SearchBox from "@/component/SearchBox/Index";
import TableBox from "@/component/TableBox/Index";
import MyContext from "@/component/MyContext/MyContext";
import UpdateCar from "./UpdateCar";

const { confirm } = Modal;

export default ()=> {

    const [ searchForm , setSearchForm ] = useState( search );
    const [ total , setTotal ] = useState(0);
    const [ carList , setCarList ] = useState([]);
    const [ activeList , setActiveList ] = useState([]);
    const [ editForm , setEditForm ] = useState({
        switch:false,
        id:0
    });

    const [ columns ] = useState([
        {
            title: '车辆型号',
            dataIndex: 'motorcycle',
            align:'center',
        },{
            title: '车牌号',
            dataIndex: 'plate_number',
            align:'center',
        },{
            title: '车身颜色',
            dataIndex: 'color',
            align:'center',
        },{
            title: '车辆状态',
            key: 'status',
            align:'center',
            render: ( row ) =>{
                return (  row.status?
                    <Button type="link">上架</Button> :  <Button danger type="text">下架</Button>
                )
            }
        },
        {
            title: '交强险到期时间',
            key: 'mandatory',
            render: (_, record) =>{
                let state = calculateRemainingDays( new Date() , record.mandatory  )
                let stateStyle = {}
                switch(state){
                    case state > 15:
                        stateStyle = { color: "#ccc" , title : record.mandatory };
                        break
                    default:
                        stateStyle = { color: "#ff4d4f" , title : record.mandatory };
                }
                return ( <span style={{ color : stateStyle.color }}> { stateStyle.title } </span> )
            },
            align:'center',
        },{
            title: '商业险到期时间',
            key: 'commercial_insurance',
            render: (_, record) =>{
                let state = calculateRemainingDays( new Date() , record.commercial_insurance )
                let stateStyle = {}
                switch(state){
                    case state > 15:
                        stateStyle = { color: "#ccc" , title : record.commercial_insurance };
                        break
                    default:
                        stateStyle = { color: "#ff4d4f" , title : record.commercial_insurance };
                }
                return ( <span style={{ color : stateStyle.color }}> { stateStyle.title } </span> )
            },
            align:'center',
        },{
            title: '操作',
            align:'center',
            width:240,
            render:(_,row)=>{
                return (
                    <div>
                        <Button type="link" onClick={ ()=>addCarOrder( true , row.id ) }>编辑</Button>
                        {   row.status?
                            <Button type="text" onClick={ _=>updateCarStatus( row.id , 0) }>下架</Button> :
                            <Button type="text" onClick={ _=>updateCarStatus( row.id , 1) }>上架</Button>
                        }
                        <Button type="link" danger onClick={ _=>deleteCarInfo( row.id ) }>删除</Button>
                    </div>
                )
            }
        },
    ])

    // 扩展信息
    const expandedRowRender = (row) => {
        return (
            <Descriptions title="详细信息" bordered size='small'>
                <Descriptions.Item label="购车金额" >{ row.money }元</Descriptions.Item>
                <Descriptions.Item label="额外花费" >{ row.expenditure }元</Descriptions.Item>
                <Descriptions.Item label="发动机号" >{ row.engine_number }</Descriptions.Item>
                <Descriptions.Item label="车辆识别号" >{ row.vin }</Descriptions.Item>
                <Descriptions.Item label="上牌时间">{ row.start_time }</Descriptions.Item>
                <Descriptions.Item label="报废时间">{ row.end_time }</Descriptions.Item>
                <Descriptions.Item label="交强险公司">{ row.mandatory_company }</Descriptions.Item>
                <Descriptions.Item label="交强险附件" span={2}>
                    {
                        JSON.parse(row.m_c_doc).map(item=>{
                            return (
                                <a target={'_blank'} href={ item.url } key={item.url} >{ item.name }</a>
                            )
                        })
                    }
                </Descriptions.Item>
                <Descriptions.Item label="行驶证照片" span={1}>
                    {
                        JSON.parse(row.driving_image).map(item=>{
                            return (
                                <Image width={100}  height={100} key={item.url} src={ item.url }/>
                            )
                        })
                    }
                </Descriptions.Item>
                <Descriptions.Item label="商业险附件" span={2}>
                    {
                        JSON.parse(row.c_i_doc).map(item=>{
                            return (
                                <a target={'_blank'} href={ item.url } key={item.url} >{ item.name }</a>
                            )
                        })
                    }
                </Descriptions.Item>
                <Descriptions.Item label="车辆图片" span={3}>
                    {
                        JSON.parse(row.car_image).map(item=>{
                            return (
                                <Image width={100}  height={100} key={item.url} src={ item.url }/>
                            )
                        })
                    }
                </Descriptions.Item>
                <Descriptions.Item label="备注" span={3}>{ row.other }</Descriptions.Item>
            </Descriptions>
        )
    };

    // 获取订单列表
    let getCarList = ()=>{
        getCarListApi( searchForm ).then(res=>{
            setCarList(res.data)
            setTotal(res.total)
        })
    }

    // 上架/下架车辆
    let updateCarStatus = ( id , status )=>{
        confirm({
            title: `确定${ status?'上架':'下架' }该车辆吗?`,
            icon: <ExclamationCircleOutlined />,
            content: '请谨慎操作！',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                // 传递给后台的0是下架，1是删除
                updateCarStatusApi({ id , status }).then(res=>{
                    message.success(res.msg);
                    getCarList()
                })
            },
        });
    }

    // 删除订单列表
    let deleteCarInfo = ( id)=>{
        confirm({
            title: `确定删除${ id?'此':'这些' }车辆吗?`,
            icon: <ExclamationCircleOutlined />,
            content: '此操作不可逆，请谨慎操作！',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                id = id?id:activeList.map(item =>item.id);
                deleteCarInfoApi({ id }).then(res=>{
                    message.success(res.msg);
                    getCarList()
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
            name :'motorcycle',
            label:'车型',
            type:'input'
        },{
            name :'plate_number',
            label:'车牌号',
            type:'input'
        }
    ]

    const endArr = [
        <Button htmlType="button" icon={<PlusOutlined />} onClick={ _=>addCarOrder( true , '' ) }>新增车辆</Button>,
        <Button danger disabled={ 0 >= activeList.length  }  icon={<DeleteOutlined />} onClick={ _=>deleteCarInfo() } > 批量删除 </Button>
    ]

    useEffect(()=>{
        getCarList()
    },[ searchForm ])

    return (
        <div>
            {
                editForm.switch?
                    <MyContext.Provider value={{
                        editForm,
                        closeEdit : () =>{ setEditForm({ ...editForm , switch :false }); getCarList() }
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
