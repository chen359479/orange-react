import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import { Table , Button ,  Input , Modal , message , } from 'antd';
import { SearchOutlined ,  DeleteOutlined , ExclamationCircleOutlined } from '@ant-design/icons';

import styles from './index.module.css';
import { getWxuserList , deleteWxuser } from '../../../api/wxuser'

const { confirm } = Modal;

class WxUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchForm:{
                username: "",
                phone: "",
                page:1,
                pageSize:10,
                total:10
            },
            wxuserList:[],
            activeUserList:[],
            columns:[
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
                                <Button type="link" danger onClick={ _=>this.deleteWxuser(row.id)}>删除</Button>
                            </div>
                        )
                    }
                },
            ],
        };
    }

    // 获取微信用户列表
    getWxuserList = ()=>{
        let { searchForm } = this.state;
        getWxuserList(searchForm).then(res=>{
            this.setState({
                wxuserList : res.data,
                searchForm :{
                    ...searchForm ,
                    total : res.total
                }
            }, this.forceUpdate)
        })
    }

    // 选中的方法
    onSelectChange = (newSelectedRowKeys) => {
        this.setState({
            activeUserList:newSelectedRowKeys
        })
    };

    // 页码 或 pageSize 的变化
    handleSizeChange=(page, pageSize)=> {
        // 判断pagesize是否发生了变化，如果是则将page改成1；
        let data = { ...this.state.searchForm, pageSize };
        pageSize !== this.state.searchForm.pageSize?data.page = 1:data.page = page;
        this.setState({
            searchForm: data
        },this.getWxuserList)
    }

    // 删除微信用户
    deleteWxuser = id=>{
        let { activeUserList } = this.state,
            that = this;
        confirm({
            title: `确定删除${ id?'当前':'这些' }微信用户吗?`,
            icon: <ExclamationCircleOutlined />,
            content: '此操作不可逆，请谨慎操作！',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                deleteWxuser({ id:id?id:activeUserList }).then(res=>{
                    message.success(res.msg);
                    that.getWxuserList()
                })
            },
        });
    }


    render() {
        let { searchForm , wxuserList , activeUserList , columns  } = this.state,
            rowSelection = {
                activeUserList,
            onChange: this.onSelectChange,
        };
        return (
            <div className={styles.WxUser}>
                <header>
                    <Input onChange={ e=>{ this.setState({ searchForm:{...searchForm, username:e.target.value } }) } } style={{width: 200,}} placeholder="请输入待搜索的用户名" />
                    <Input onChange={ e=>{ this.setState({ searchForm:{ ...searchForm, phone:e.target.value }}) } } style={{width: 200,}} placeholder="请输入待搜索的手机号" />
                    <Button type="primary" icon={<SearchOutlined />} onClick={ this.getWxuserList }> 搜索 </Button>

                    <Button danger disabled={ 0 >= activeUserList.length  }  icon={<DeleteOutlined />} onClick={ this.deleteWxuser }> 批量删除 </Button>
                </header>
                <Table bordered rowKey={ row => row.id }  rowSelection={ rowSelection } columns={columns} dataSource={ wxuserList } pagination={{
                    current:searchForm.page,
                    pageSize:searchForm.pageSize,
                    total:searchForm.total,
                    showTotal:(total) => `共${total}条数据`,
                    onChange : this.handleSizeChange
                }} />
            </div>
        )
    }

    // 渲染完成
    componentDidMount() {
        this.getWxuserList()
    }

    // 组件卸载
    componentWillUnmount() {
    }
}

export default withRouter(WxUser)
