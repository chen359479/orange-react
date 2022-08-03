import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

import { Table , Button ,  Select  , Modal , message , } from 'antd';
import {  DeleteOutlined , ExclamationCircleOutlined } from '@ant-design/icons';

import { getArticleTopClass , getArticleSecondaryClass  } from '../../../api/class';
import { getArticleList , deleteArticle } from '../../../api/article';

import styles from './index.module.css';

const { Option } = Select;
const { confirm } = Modal;
class ArticleInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchForm:{
                tableName:"",
                title:'全部',
                page:1,
                pageSize:10
            },
            // 顶级分类
            topClass:[],
            // 次级分类
            secondaryClass:[],
            activeData:[],
            activeArticleList:[],
            columns:[
                {
                    title: '标题',
                    dataIndex: 'title',
                    align:'center',
                    width:800
                },{
                    title: '创建时间',
                    dataIndex: 'time',
                    align:'center',
                },{
                    title: '语言',
                    dataIndex: 'lang',
                    align:'center',
                },{
                    title: '大小',
                    dataIndex: 'size',
                    align:'center',
                },{
                    title: '操作',
                    align:'center',
                    width:160,
                    render:(_,row)=>{
                        return (
                            <div>
                                <Button type="link" >编辑</Button>
                                <Button type="link" danger onClick={ _=>this.deleteArticle(row.id) }>删除</Button>
                            </div>
                        )
                    }
                },
            ],
        };
    }

    // 获取顶级分类
    getArticleTopClass =_=>{
        getArticleTopClass().then(res=>{
            this.setState({
                topClass: res.data,
                searchForm:{
                    ...this.state.searchForm,
                    tableName : res.data[0].name
                }
            },_=>{ this.getArticleSecondaryClass(res.data[0].name)} )

        })
    }

    // 获取顶级分类下的次级分类
    getArticleSecondaryClass = name => {
        let { topClass , searchForm } = this.state;
        let { id } = topClass.filter(item=>item.name === name)[0];
        getArticleSecondaryClass({id}).then(res=>{
            this.setState({
                secondaryClass:[{ title:"全部"}].concat(res.data),
                searchForm :{
                    ...searchForm,
                    title:"全部",
                    page:1
                }
            }, this.getArticleList)
        })
    }

    // 顶级分类的切换
    topClassChange=(tableName)=>{
        let { searchForm } = this.state;
        this.setState({
            searchForm : { ...searchForm , tableName }
        },_=>this.getArticleSecondaryClass(tableName))
    }

    // 次级分类的切换
    secondaryClassChange = (title)=>{
        let { searchForm } = this.state;
        this.setState({
            searchForm : { ...searchForm , title }
        },this.getArticleList)
    }

    // 获取数据
    getArticleList=()=>{
        let s = { ...this.state.searchForm }
        if(s.title === "全部")s.title = "";

        getArticleList(s).then(res=>{
            this.setState({
                activeData:res.data,
                searchForm:{
                    ...this.state.searchForm,
                    total: res.total
                }
            })
        },this.forceUpdate)
    }

    // 选中的方法
    onSelectChange = (newSelectedRowKeys) => {
        this.setState({
            activeArticleList:newSelectedRowKeys
        })
    };

    // 删除
    deleteArticle= id=>{
        let { tableName } = this.state.searchForm,
            that = this,
            { activeArticleList } = this.state;

        confirm({
            title: `确定删除${ id?'此条':'这些' }内容吗?`,
            icon: <ExclamationCircleOutlined />,
            content: '此操作不可逆，请谨慎操作！',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                deleteArticle({id:id?id:activeArticleList,tableName}).then(res=>{
                    message.success(res.msg);
                    that.getArticleList()
                })
            },
        });
    }

    // 页码 或 pageSize 的变化
    handleSizeChange=(page, pageSize)=> {
        // 判断pagesize是否发生了变化，如果是则将page改成1；
        let data = { ...this.state.searchForm, pageSize };
        pageSize !== this.state.searchForm.pageSize?data.page = 1:data.page = page;
        this.setState({
            searchForm: data
        },this.getArticleList)
    }

    render() {
        let { searchForm , topClass , secondaryClass , activeArticleList , activeData , columns , } = this.state,
            rowSelection = {
                activeArticleList,
                onChange: this.onSelectChange,
            };
        return (
            <div className={ styles.ArticleInfo }>
                <header>
                    <Select value={ searchForm.tableName } style={{ width: 150 }} onChange={ this.topClassChange }>
                        {
                            topClass && topClass.map(item=><Option key={item.name} value={ item.name }> { item.title } </Option>)
                        }
                    </Select>
                    <Select value={ searchForm.title }  style={{ width: 150 }} onChange={ this.secondaryClassChange }>
                        {
                            secondaryClass && secondaryClass.map(item=><Option key={item.title} value={ item.title }> { item.title } </Option>)
                        }
                    </Select>

                    <Button danger disabled={ 0 >= activeArticleList.length  }  icon={<DeleteOutlined />} onClick={ this.deleteArticle } > 批量删除 </Button>
                </header>

                <Table bordered rowKey={ row => row.id }  rowSelection={ rowSelection } columns={ columns } dataSource={ activeData } pagination={{
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
        this.getArticleTopClass()
    }

    // 组件卸载
    componentWillUnmount() {
    }
}

export default withRouter(ArticleInfo)
