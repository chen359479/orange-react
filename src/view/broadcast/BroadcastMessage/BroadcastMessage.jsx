import { useState ,  useEffect } from 'react';
import {  Button ,   Modal , message } from 'antd';
import {DeleteOutlined,} from "@ant-design/icons";

import { getBroadcastList as getBroadcastListApi , deleteBroadcast as deleteBroadcastApi , getBroadcastInfo as getBroadcastInfoApi } from '../../../api/broadcast'

import ReadMessage from "./ReadMessage";
import MyContext from "@/component/MyContext/MyContext";
import TableBox from '@/component/TableBox/Index';
import SearchBox from "@/component/SearchBox/Index";

import { search , confirmMsg , gradeTypeList } from '@/assets/js/public';

const { confirm } = Modal;
export default ( )=> {
    // 搜索表单
    const [ searchForm , setSearchForm ] = useState(search)
    // 选中的列表
    const [ activeList , setActiveList ] = useState([]);
    // 广播列表
    const [ gradeList , setGradeList ] = useState([]);
    const [ rg , setRg ] = useState([]);
    const [ msgData , setMsgData ] = useState({});
    const [ readShow , setReadShow ] = useState(false);
    const [ total , setTotal ] = useState(0);
    const [ columns ] = useState([
        {
            title: '标题',
            dataIndex: 'title',
            align:'center',
            width:800,
            render:(_,row)=>{
                return (
                    <Button type={ !row.pastDue && !row.read?'link':'text'  } >{ row.title } </Button>
                )
            }
        },{
            title: '创建时间',
            dataIndex: 'created_time',
            align:'center'
        },{
            title: '发布者',
            dataIndex: 'username',
            align:'center',
        },{
            title: '操作',
            align:'center',
            width:160,
            render:(_,row)=>{
                return (
                    <div>
                        <Button type="link" onClick={ _=>{ readMsg(row) } }>查阅</Button>
                        <Button type="link" danger onClick={ _=>deleteGrade(row.id) }>删除</Button>
                    </div>
                )
            }
        },
    ])

    // 获取广播消息
    let getBroadcastList = ()=>{
        getBroadcastListApi( searchForm ).then(res=>{
            setGradeList(res.data.map(item=>{
                item.read = rg.includes(item.id);
                return item;
            }))
            setTotal(res.total)
        })
    }

    // 删除广播的方法
    let deleteGrade= id=>{
        confirm({
            title: `确定删除${ id?'此条':'这些' }广播吗?`,
            ...confirmMsg,
            onOk() {
                deleteBroadcastApi({id:id?id:activeList}).then(res=>{
                    message.success(res.msg)
                    getBroadcastList()
                })
            },
        });
    }

    // 查阅消息
    let readMsg = row=>{
        let id = row.id;
        if(!rg.includes(id)){
            setRg([ ...rg,id ])
        }

        getBroadcastInfoApi(id).then(res=>{
            setMsgData({
                ...row,
                content : res.data,
                grade : gradeTypeList.filter(item=>item.value === row.grade)[0].label
            })
            setReadShow( true );
        })
    }

    let startArr = [
        {
            name :'grade',
            label:'等级',
            type:'option',
            selectData: gradeTypeList
        },{
            name :'title',
            label:'消息名称',
            type:'input'
        },{
            name :'username',
            label:'发布者',
            type:'input'
        }
    ]

    const endArr = [
        <Button danger disabled={ 0 >= activeList.length  }  icon={<DeleteOutlined />} onClick={ _=>deleteGrade() } > 批量删除 </Button>
    ]

    useEffect(()=>{
        let rg = localStorage.getItem("readGrade") || '[]';
        setRg(JSON.parse(rg));
        return ()=>{
            localStorage.setItem('readGrade',JSON.stringify(rg))
        }
    },[])

    useEffect(()=>{
        getBroadcastList()
    },[ searchForm ])

    return (
        <div>
            {
                !readShow?
                    <SearchBox startArr={ startArr } endArr={endArr} searchForm={ searchForm } setSearchForm={ setSearchForm } />:
                    <MyContext.Provider value={{
                        msgData,
                        closeRead : () =>{ setReadShow(false) }
                    }}>
                        <ReadMessage  />
                    </MyContext.Provider>
            }
            <TableBox show={ readShow } columns={ columns } activeList={activeList} setActiveList={setActiveList}
                      dataSource={ gradeList } searchForm={searchForm} total={total} setSearchForm={setSearchForm} />
        </div>
    )
}
