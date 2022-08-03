import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import { Table , Button ,  Select  , Modal , message ,  Form , Input } from 'antd';
import {DeleteOutlined, ExclamationCircleOutlined} from "@ant-design/icons";
import moment from 'moment';

import { getBroadcastList , deleteBroadcast , getBroadcastInfo  } from '../../../api/broadcast'

import ReadMessage from "./ReadMessage";
import styles from './index.module.css';

const { Option } = Select;
const { confirm } = Modal;
class BroadcastMessage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchForm:{ // 搜索文档的
                title:"",
                username:"",
                grade:0,
                page:1,
                pageSize:10,
                total:10,
            },
            gradeTypeList:[ // 广播消息等级
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
            ],
            activeList:[], // 选中的列表
            gradeList:[], // 广播列表
            rg:[],  // 已读列表
            columns:[
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
                    align:'center',
                    render:time=>{
                        return ( <span> { moment(time).format('YYYY-MM-DD HH:mm:ss') } </span> )
                    }
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
                                <Button type="link" onClick={ _=>{ this.readMsg(row) } }>查阅</Button>
                                <Button type="link" danger onClick={ _=>this.deleteGrade(row.id) }>删除</Button>
                            </div>
                        )
                    }
                },
            ],
            msgData:{},
            readShow:false
        };
    }

    // 创建表单域
    formRef = React.createRef();

    // 获取广播消息
    getBroadcastList = _=>{
        let { searchForm , rg } = this.state;
        getBroadcastList( searchForm ).then(res=>{
            this.setState({
                gradeList :res.data.map(item=>{
                    item.read = rg.includes(item.id);
                    return item;
                }),
                searchForm:{ ...searchForm, total:res.total }
            },this.forceUpdate)
        })
    }

    // 选中的方法
    onSelectChange = (newSelectedRowKeys) => {
        this.setState({
            activeList:newSelectedRowKeys
        })
    };

    // 删除广播的方法
    deleteGrade= id=>{
        let that = this,
            { activeList } = this.state;

        confirm({
            title: `确定删除${ id?'此条':'这些' }广播吗?`,
            icon: <ExclamationCircleOutlined />,
            content: '此操作不可逆，请谨慎操作！',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                deleteBroadcast({id:id?id:activeList}).then(res=>{
                    message.success(res.msg)
                    that.getBroadcastList()
                })
            },
        });
    }

    // 重置方法
    onReset = () => {
        this.formRef.current.resetFields();
    };

    // 表单验证成功
    onFinish = e=>{
        let { searchForm } = this.state;
        this.setState({
            searchForm:{
                ...searchForm,
                ...e
            }
        },this.getBroadcastList)
    }

    // 页码 或 pageSize 的变化
    handleSizeChange=(page, pageSize)=> {
        // 判断pagesize是否发生了变化，如果是则将page改成1；
        let data = { ...this.state.searchForm, pageSize };
        pageSize !== this.state.searchForm.pageSize?data.page = 1:data.page = page;
        this.setState({
            searchForm: data
        },this.getBroadcastList)
    }

    // 查阅消息
    readMsg = row=>{
        let { rg  } = this.state,
            id = row.id;
        if(!rg.includes(id)){
            this.setState({
                rg:[ ...rg,id ]
            })
        }

        getBroadcastInfo(id).then(res=>{
            let { gradeTypeList } = this.state;
            this.setState({
                readShow : true,
                msgData:{
                    ...row,
                    content:res.data,
                    grade:gradeTypeList.filter(item=>item.value === row.grade)[0].label
                }
            })
        })
    }

    render() {
        let { gradeTypeList , searchForm , activeList , columns , gradeList , readShow , msgData  } = this.state,
            rowSelection = {
                activeList,
                onChange: this.onSelectChange,
            };
        return (
            <div  className={ styles.BroadcastMessage }>
                <header style={{ display:readShow?"none":"block" }}>
                    <Form
                        name="searchForm"
                        labelCol={{ span: 0, }}
                        wrapperCol={{ span: 24, }}
                        initialValues={ searchForm }
                        autoComplete="off"
                        layout="inline"
                        ref={ this.formRef }
                        onFinish={ this.onFinish }
                    >
                        <Form.Item name="grade">
                            <Select style={{ width: 150 }} >
                                {
                                    gradeTypeList && gradeTypeList.map(item=><Option key={item.value} value={ item.value }> { item.label } </Option>)
                                }
                            </Select>
                        </Form.Item>

                        <Form.Item name="title">
                            <Input placeholder={"请输入待搜索的消息名称"}/>
                        </Form.Item>

                        <Form.Item name="username">
                            <Input placeholder={"请输入待搜索的发布者"}/>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit">搜索</Button>
                        </Form.Item>

                        <Form.Item>
                            <Button htmlType="button" onClick={this.onReset}>重置</Button>
                        </Form.Item>

                        <Form.Item>
                            <Button danger disabled={ 0 >= activeList.length  }  icon={<DeleteOutlined />} onClick={ this.deleteGrade } > 批量删除 </Button>
                        </Form.Item>
                    </Form>
                </header>
                <Table
                    style={{ display:readShow?"none":"block" }}
                    bordered rowKey={ row => row.id }
                    rowSelection={ rowSelection }
                    columns={ columns }
                    dataSource={ gradeList }
                    pagination={{
                        current:searchForm.page,
                        pageSize:searchForm.pageSize,
                        total:searchForm.total,
                        showTotal:(total) => `共${total}条数据`,
                        onChange : this.handleSizeChange
                    }} />
                {
                    readShow?<ReadMessage msgData={ msgData } closeRead = { _=>this.setState({ readShow : false })}/>:null
                }
            </div>
        )
    }

    // 渲染完成
    componentDidMount() {
        let rg = localStorage.getItem("readGrade") || '[]';
        this.setState({
            rg : JSON.parse(rg)
        },this.getBroadcastList);

    }

    // 组件卸载
    componentWillUnmount() {
        localStorage.setItem('readGrade',JSON.stringify(this.state.rg))
    }
}

export default withRouter(BroadcastMessage)
