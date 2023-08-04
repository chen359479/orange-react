import { useState , useEffect } from 'react';

import {  Button ,  Modal , message } from 'antd';
import {  PlusOutlined , DeleteOutlined } from '@ant-design/icons';

import store from "@/store";
import { search , confirmMsg } from '@/assets/js/public';
import { getUserList as getUserListApi ,  deleteUser as deleteUserApi } from '@/api/user';

import MyContext from "@/component/MyContext/MyContext";
import EditUser from "@/component/EditUser/EditUser";
import UpdateUserPassword from "@/component/UpdateUserPassword/UpdateUserPassword";
import SearchBox from "@/component/SearchBox/Index";
import TableBox from "@/component/TableBox/Index";

const { confirm } = Modal;
export default () =>{
    const [ total , setTotal ] = useState(0);
    const [ upUserPasswordShow , setUpUserPasswordShow ] = useState(false);
    const [ upUserPasswordId , setUpUserPasswordId ] = useState(0);
    const [ userList , setUserList ] = useState([]);
    const [ selectedRowKeys , setSelectedRowKeys ] = useState([]);
    const [ searchForm , setSearchForm ] = useState( search );

    const { userJit , userState  } = store.getState().user;
    const [ userStateList ] = useState([
        {
            label: "全部",
            value: 0
        },
        ...userState
    ]);

    // 初始化用户信息
    let initUserInfo = ()=>{
        return {
            username:"",
            phone:"",
            state:1,
            sex:1,
            type:"user",
            broadcast:1,
            title:"",
            visible:false
        }
    }

    const [ userForm , setUserForm ] = useState( initUserInfo() );
    const [ columns ] = useState([
        {
            title: '用户名',
            dataIndex: 'username',
            align:'center',
        },{
            title: '角色',
            dataIndex: 'type',
            align:'center',
            render: (text) =><span> {userJit.filter(item=>item.value === text)[0].label} </span>,
        },{
            title: '手机号',
            dataIndex: 'phone',
            align:'center',
        },{
            title: '性别',
            dataIndex: 'sex',
            render: (text) => <span>{Number(text)?'男':'女'}</span>,
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
                return ( <span style={stateStyle}> {userState.filter(item=>Number(item.value) === state)[0].label} </span> )
            },
            align:'center',
        },{
            title: '最近操作时间',
            dataIndex: 'update_time',
            align:'center',
        },{
            title: '操作',
            align:'center',
            width:260,
            render:(_,row)=>{
                return (
                    <div>
                        <Button type="link" onClick={_=>editUser('edit',row)}>编辑</Button>
                        <Button type="link" danger onClick={_=>deleteUser(row.id)}>删除</Button>
                        <Button type="text" onClick={ _=>updateUserPassword(row.id) }>修改密码</Button>
                    </div>
                )
            }
        },
    ])

    // 获取用户列表
    let getUserLists=()=>{
        getUserListApi(searchForm).then(res=>{
            setUserList(res.data);
            setTotal(res.total)
        })
    }

    // 添加用户或修改用户信息
    let editUser = ( e , row )=>{
        let userForm;
        if( e === "add" ){
            userForm = initUserInfo()
        }else {
            userForm = {
                ...row,
                title:"编辑用户",
                visible:true
            }
        }
        setUserForm(userForm)
    };

    // 关闭编辑用户
    let closeEditUser = ()=>{
        setUserForm({
            ...userForm ,
            visible:false
        })
    }

    // 删除用户
    let deleteUser = id=>{
        confirm({
            title: `确定删除${ id?'此':'这些' }用户吗?`,
            ...confirmMsg,
            onOk() {
                deleteUserApi({ id:id?id:selectedRowKeys }).then(res=>{
                    message.success(res.msg);
                    getUserLists()
                })
            },
        });
    }

    // 修改用户密码
    let updateUserPassword= id =>{
        setUpUserPasswordId(id);
        setUpUserPasswordShow(true)
    }

    // 关闭
    let closeUpdateUserPassword = ()=>{
        setUpUserPasswordShow(false)
    }

    const startArr = [
        {
            name :'state',
            label:'状态',
            type:'option',
            selectData:userStateList
        },{
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
        <Button type="ghost" icon={<PlusOutlined />} onClick={ _=>editUser('add')}> 添加 </Button>,
        <Button danger disabled={ 0 >= selectedRowKeys.length  }  icon={<DeleteOutlined />} onClick={  _=>deleteUser() } > 批量删除 </Button>
    ]

    useEffect(()=>{
        getUserLists()
    }, [ userForm , searchForm ])

    return (
        <div>
            <SearchBox startArr={ startArr } endArr={endArr} searchForm={ searchForm } setSearchForm={ setSearchForm }/>

            <TableBox columns={ columns } activeList={ selectedRowKeys } setActiveList={ setSelectedRowKeys }
                      dataSource={ userList } searchForm={searchForm} total={total} setSearchForm={setSearchForm} />

            {
                userForm.visible?
                    <MyContext.Provider value={{
                        userForm,
                        closeEditUser
                    }}>
                        <EditUser/>
                    </MyContext.Provider>

                :null
            }
            {
                upUserPasswordShow?
                    <MyContext.Provider value={{
                        visible: upUserPasswordShow,
                        id: upUserPasswordId ,
                        closeUpdateUserPassword
                    }}>
                        <UpdateUserPassword/>
                    </MyContext.Provider>
                :null
            }
        </div>
    )
}
