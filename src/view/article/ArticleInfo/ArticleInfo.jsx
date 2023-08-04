import { useState , useEffect } from 'react';

import { Button , Modal , message , } from 'antd';
import {  DeleteOutlined , PlusOutlined } from '@ant-design/icons';

import { getTopClass  as getTopClassApi } from '@/api/class';
import { getArticleList as getArticleListApi , deleteArticle as deleteArticleApi } from '@/api/article';

// 引入组件
import MyContext from "@/component/MyContext/MyContext";
import UpdateArticleInfoBox from "./UpdateArticleInfo";
import TableBox from '@/component/TableBox/Index';
import SearchBox from "@/component/SearchBox/Index";

import { search , confirmMsg , statusList } from '@/assets/js/public';

const { confirm } = Modal;

export default ()=> {
    const [ searchForm , setSearchForm ] = useState(search);
    const [ editForm , setEditForm ] = useState({
        switch:false,
        id:0,
        classID:""
    });

    const [ topClass , setTopClass ] = useState([]);
    const [ articleData , setArticleData ] = useState([]);
    const [ total , setTotal ] = useState([]);
    const [ activeArticleList , setActiveArticleList ] = useState([]);
    const columns = [
            {
                title: '标题',
                dataIndex: 'title',
                align:'center',
                width:800
            },{
                title: '价格',
                dataIndex: 'price',
                align:'center',
            },{
                title: '状态',
                dataIndex: 'status',
                align:'center',
                render: state =>{
                    let stateStyle = {};
                    switch(state){
                        case true:
                            stateStyle = { color: "#52c41a" };
                            break
                        case false:
                            stateStyle = { color: "#faad14" };
                            break
                    }
                    return ( <span style={stateStyle}> { state? "上架":"下架" } </span> )
                },
            },{
                title: '浏览次数',
                dataIndex: 'hits',
                align:'center',
            },{
                title: '创建时间',
                dataIndex: 'created_time',
                align:'center',
            },{
                title: '操作',
                align:'center',
                width:160,
                render:(_,row)=>{
                    return (
                        <div>
                            <Button type="link" onClick={ ()=>addArticle( true , row.id ) }>编辑</Button>
                            <Button type="link" danger onClick={ _=>deleteArticle(row.id) }>删除</Button>
                        </div>
                    )
                }
            },
        ];

    // 获取顶级分类
    let getTopClass = _=>{
        getTopClassApi({ type : 1 }).then(res=>{
            setTopClass(res.data);
            setSearchForm({
                ...searchForm,
                classID : res.data[0].id
            })
        })
    }

    // 获取数据
    let getArticleList = ()=>{
        getArticleListApi({
            ...searchForm,
            type:searchForm.type=== 2? null: searchForm.type
        }).then(res=>{
            setArticleData(res.data);
            setTotal(res.total)
        })
    }

    // 删除
    let deleteArticle= id=>{
        confirm({
            title: `确定删除${ id?'此条':'这些' }内容吗?`,
            ...confirmMsg,
            onOk() {
                deleteArticleApi({id:id? id : activeArticleList }).then(res=>{
                    message.success(res.msg);
                    getArticleList()
                })
            },
        });
    }

    // 添加资源内容
    let addArticle = ( val ,id )=>{
        setEditForm({
            switch : val,
            id,
            classID: searchForm.classID
        })
    }

    let startArr = [
        {
            name :'classID',
            label:'类别',
            type:'option',
            selectData: topClass
        },{
            name :'type',
            label:'状态',
            type:'option',
            selectData: statusList
        }
    ]

    const endArr = [
        <Button type="primary"  icon={<PlusOutlined />} onClick={ ()=>addArticle(true) } > 添加 </Button>,
        <Button danger disabled={ 0 >= activeArticleList.length  }  icon={<DeleteOutlined />} onClick={ _=>deleteArticle() } > 批量删除 </Button>
    ]

    useEffect(()=>{
        getTopClass()
    },[ ])

    useEffect(()=>{
        getArticleList()
    },[ searchForm ])

    return (
        <div>
            {
                editForm.switch?
                    <MyContext.Provider value={{
                        editForm,
                        closeEdit : () =>{ setEditForm({ ...editForm , switch :false }); getArticleList() }
                    }}>
                        <UpdateArticleInfoBox  />
                    </MyContext.Provider>
                    :
                    <SearchBox startArr={ startArr } endArr={endArr} searchForm={ searchForm } setSearchForm={ setSearchForm }/>
            }

            <TableBox show={ editForm.switch } columns={ columns } activeList={activeArticleList} setActiveList={ setActiveArticleList }
                      dataSource={ articleData } searchForm={searchForm} total={total} setSearchForm={setSearchForm} />
        </div>
    )
}
