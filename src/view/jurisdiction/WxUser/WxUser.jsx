import { useState , useEffect   } from 'react';

import { Button ,   Modal , message  } from 'antd';
import {  DeleteOutlined } from '@ant-design/icons';

import { getWxuserList as getWxuserListApi , deleteWxuser as deleteWxuserApi } from '@/api/wxuser';
import { search , confirmMsg } from "@/assets/js/public";

import SearchBox from "@/component/SearchBox/Index";
import TableBox from "@/component/TableBox/Index";

const { confirm } = Modal;

export default ()=> {
    const [ searchForm , setSearchForm ] = useState(search);

    const [ total , setTotal ] = useState(0);
    const [ wxuserList , setWxuserList ] = useState([]);
    const [ activeUserList , setActiveUserList ] = useState([]);
    const [ columns ] = useState([
        {
            title: '用户名',
            dataIndex: 'username',
            align:'center',
        },{
            title: '手机号',
            dataIndex: 'phone',
            align:'center',
        },{
            title: '性别',
            dataIndex: 'sex',
            render: (sex) => <span>{Number(sex)?'男':'女'}</span>,
            align:'center',
        },{
            title: '城市',
            dataIndex: 'city',
            align:'center',
        },{
            title: '创建时间',
            dataIndex: 'created_time',
            align:'center',
        },{
            title: '操作',
            align:'center',
            width:100,
            render:(_,row)=>{
                return (
                    <div>
                        <Button type="link" danger onClick={ _=>deleteWxuser(row.id)}>删除</Button>
                    </div>
                )
            }
        }
    ]);


    // 获取微信用户列表
    let getWxuserList = ()=>{
        getWxuserListApi(searchForm).then(res=>{
            setWxuserList(res.data);
            setTotal(res.total)
        })
    }

    // 删除微信用户
    let deleteWxuser = id=>{
        confirm({
            title: `确定删除${ id?'当前':'这些' }微信用户吗?`,
            ...confirmMsg,
            onOk() {
                deleteWxuserApi({ id:id?id:activeUserList }).then(res=>{
                    message.success(res.msg);
                    getWxuserList()
                })
            },
        });
    }

    const startArr = [
        {
            name :'username',
            label:'用户名',
            type:'input'
        },{
            name :'phone',
            label:'手机号',
            type:'input'
        }
    ]

    const endArr = [
        <Button danger disabled={ 0 >= activeUserList.length  }  icon={<DeleteOutlined />} onClick={ _=>deleteWxuser() }> 批量删除 </Button>
    ]

    useEffect(()=>{
        getWxuserList()
    }, [ searchForm ])

    return (
        <div >
            <SearchBox startArr={ startArr } endArr={endArr} searchForm={ searchForm } setSearchForm={ setSearchForm }/>
            <TableBox columns={ columns } activeList={ activeUserList } setActiveList={ setActiveUserList }
                      dataSource={ wxuserList } searchForm={searchForm} total={total} setSearchForm={setSearchForm} />
        </div>
    )
}
