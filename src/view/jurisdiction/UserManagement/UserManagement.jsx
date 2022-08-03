import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import { Table , Button , Select , Input , Modal , message , } from 'antd';
import { SearchOutlined , PlusOutlined , DeleteOutlined , ExclamationCircleOutlined } from '@ant-design/icons';

import styles from './index.module.css';
import userInfo from '../../../assets/js/userInfo';
import { getUserList ,  deleteUser  } from '../../../api/user';

import EditUser from "../../../component/EditUser/EditUser";
import UpdateUserPassword from "../../../component/UpdateUserPassword/UpdateUserPassword";

const { Option } = Select;
const { confirm } = Modal;
class UserManagement extends Component {
    constructor(props) {
        super(props);

        this.state = {
            columns:[
                {
                    title: '用户名',
                    dataIndex: 'username',
                    align:'center',
                },{
                    title: '角色',
                    dataIndex: 'type',
                    align:'center',
                    render: (text) =><span> {userInfo.userJit.filter(item=>item.value === text)[0].label} </span>,
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
                        return ( <span style={stateStyle}> {userInfo.userState.filter(item=>Number(item.value) === state)[0].label} </span> )
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
                                <Button type="link" onClick={_=>this.editUser('edit',row)}>编辑</Button>
                                <Button type="link" danger onClick={_=>this.deleteUser(row.id)}>删除</Button>
                                <Button type="text" onClick={ _=>this.updateUserPassword(row.id) }>修改密码</Button>
                            </div>
                        )
                    }
                },
            ],
            userList:[], // 用户列表
            selectedRowKeys:[], // 选中的用户列表
            searchForm: {  // 搜索用户表单
                username: "",
                phone: "",
                state: 0,
                page:1,
                pageSize:10,
                total:10
            },
            userStateList:[  // 搜索的用户状态
                {
                    label: "全部",
                    value: 0
                },
                ...userInfo.userState
            ],
            userForm:{  // 用户信息
                username:"",
                phone:"",
                state:1,
                sex:1,
                type:"user",
                broadcast:1,
                title:"",
                visible:false
            },
            upUserPasswordShow : false, //用来控制更改密码的显隐
            upUserPasswordId : 0, // 被修改密码用户的ID
        };
    }

    // 选中的方法
    onSelectChange = (newSelectedRowKeys) => {
        this.setState({
            selectedRowKeys:newSelectedRowKeys
        })
    };

    // 获取用户列表
    getUserLists=()=>{
        let { searchForm } = this.state;
        getUserList(searchForm).then(res=>{
            this.setState({
                userList:res.data,
                searchForm:{
                    ...this.state.searchForm,
                    total:res.total
                }
            })
        })
    }

    // 页码 或 pageSize 的变化
    handleSizeChange=(page, pageSize)=> {
        // 判断pagesize是否发生了变化，如果是则将page改成1；
        let data = { ...this.state.searchForm, pageSize };
        pageSize !== this.state.searchForm.pageSize?data.page = 1:data.page = page;
        this.setState({
            searchForm: data
        },this.getUserLists)
    }

    // 添加用户或修改用户信息
    editUser = ( e , row )=>{
        let userForm;
        if( e === "add" ){
            userForm = {
                username:"",
                phone:"",
                state:1,
                sex:1,
                type:"user",
                broadcast:1,
                title:"添加用户",
                visible:true
            }
        }else {
            userForm = {
                ...row,
                title:"编辑用户",
                visible:true
            }
        }
        this.setState({
            userForm
        })
    };

    // 关闭编辑用户
    closeEditUser = ()=>{
        this.setState({
            userForm:{
                ...this.state.userForm,
                visible:false
            }
        },this.getUserLists)
    }

    // 删除用户
    deleteUser = id=>{
        let { selectedRowKeys } = this.state,
            that = this;
        confirm({
            title: `确定删除${ id?'当前':'这些' }用户吗?`,
            icon: <ExclamationCircleOutlined />,
            content: '此操作不可逆，请谨慎操作！',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                deleteUser({ id:id?id:selectedRowKeys }).then(res=>{
                    message.success(res.msg);
                    that.getUserLists()
                })
            },
        });
    }

    // 修改用户密码
    updateUserPassword= id =>{
        this.setState({
            upUserPasswordShow : true,
            upUserPasswordId : id
        })
    }

    // 关闭
    closeUpdateUserPassword = ()=>{
        this.setState({
            upUserPasswordShow : false
        })
    }

    render() {
        let { columns , userList , selectedRowKeys , userStateList , searchForm , userForm , upUserPasswordShow , upUserPasswordId } = this.state;
        let rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        return (
            <div className={ styles.UserManagement }>
                <header>
                    <Select
                        defaultValue={ searchForm.state }
                        style={{ width: 150, }}
                        onChange={ e=>{ this.setState({ searchForm:{ ...searchForm, state:e }}) } }
                    >
                        {
                            userStateList.map(item => <Option key={ item.value } value={ item.value }>{item.label}</Option> )
                        }
                    </Select>
                    <Input onChange={ e=>{ this.setState({ searchForm:{...searchForm, username:e.target.value } }) } } style={{width: 200,}} placeholder="请输入待搜索的用户名" />
                    <Input onChange={ e=>{ this.setState({ searchForm:{ ...searchForm, phone:e.target.value }}) } } style={{width: 200,}} placeholder="请输入待搜索的手机号" />
                    <Button type="primary" icon={<SearchOutlined />} onClick={ this.getUserLists }> 搜索 </Button>
                    <Button type="ghost" icon={<PlusOutlined />} onClick={ _=>this.editUser('add')}> 添加 </Button>
                    <Button danger disabled={ 0 >= selectedRowKeys.length  }  icon={<DeleteOutlined />} onClick={ this.deleteUser }> 批量删除 </Button>
                </header>
                <Table bordered rowKey={ row => row.id }  rowSelection={rowSelection} columns={columns} dataSource={userList} pagination={{
                    current:searchForm.page,
                    pageSize:searchForm.pageSize,
                    total:searchForm.total,
                    showTotal:(total) => `共${total}条数据`,
                    onChange : this.handleSizeChange
                }} />
                {
                    userForm.visible?<EditUser userForm={ userForm } closeEditUser={this.closeEditUser.bind(this)}/>:null
                }
                {
                    upUserPasswordShow?<UpdateUserPassword visible={upUserPasswordShow} id={upUserPasswordId} closeUpdateUserPassword={this.closeUpdateUserPassword} />:null
                }
            </div>
        )
    }

    // 渲染完成
    componentDidMount() {
        this.getUserLists()
    }

    // 组件卸载
    componentWillUnmount() {
    }
}

export default withRouter(UserManagement)
