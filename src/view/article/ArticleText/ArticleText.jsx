import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

import { Table , Button ,  Select  , Modal , message , } from 'antd';
import {  DeleteOutlined , ExclamationCircleOutlined } from '@ant-design/icons';

import { getArticleTextClass  } from '../../../api/class';
import { getArticleInfo, getArticleTextList , deleteArticle } from '../../../api/article';
import UpdateArticleText from './UpdateArticleText'

import styles from './index.module.css';

const { Option } = Select;
const { confirm } = Modal;
class ArticleText extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchForm:{
                tableName:"",
                page:1,
                pageSize:10
            },
            articleTextClass:[], // 文本信息的分类
            activeTextData:[],  // 表格数据
            activeArticleList:[], // 多选选中的数据
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
                    title: '操作',
                    align:'center',
                    width:160,
                    render:(_,row)=>{
                        return (
                            <div>
                                <Button type="link" onClick={ _=>this.updateArticleText(row) }>编辑</Button>
                                <Button type="link" danger onClick={ _=>this.deleteArticle(row.id) }>删除</Button>
                            </div>
                        )
                    }
                },
            ],
            edit:false,  // 编辑的开关
            editForm:{   // 编辑的表单
                id:"",
                tableName:"",
                title:""
            }
        };
    }

    // 获取分类数据
    getArticleTextClass=()=>{
        getArticleTextClass().then(res=>{
            this.setState({
                articleTextClass : res.data,
                searchForm:{
                    ...this.state.searchForm,
                    tableName:res.data[0].name
                }
            },this.getArticleTextList)
        })
    }


    // 获取数据
    getArticleTextList=()=>{
        let s = { ...this.state.searchForm }
        if(s.title === "全部")s.title = "";

        getArticleTextList(s).then(res=>{
            this.setState({
                activeTextData:res.data,
                searchForm:{
                    ...this.state.searchForm,
                    total: res.total
                }
            },this.forceUpdate)
        })
    }

    // 选中的方法
    onSelectChange = (newSelectedRowKeys) => {
        this.setState({
            activeArticleList:newSelectedRowKeys
        })
    };

    articleTextClassChange = (tableName)=>{
        let { searchForm } = this.state;
        this.setState({
            searchForm : { ...searchForm , tableName }
        },this.getArticleTextList)
    }

    // 删除
    deleteArticle= id=>{
        let that = this,
            { tableName } = this.state.searchForm,
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
                    that.getArticleTextList()
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
        },this.getArticleTextList)
    }

    // 编辑文本信息
    updateArticleText = row=>{
        let d = { id:row.id , lang:this.state.searchForm.tableName };
        getArticleInfo(d).then(res =>{
            this.setState({
                edit:true,  // 编辑的开关
                editForm:{   // 编辑的表单
                    content: res.data.content,
                    title:row.title,
                    id:row.id ,
                    tableName:this.state.searchForm.tableName
                }
            })
        })
    }

    render() {
        let { searchForm , articleTextClass , activeArticleList , activeTextData , columns , edit , editForm } = this.state,
            rowSelection = {
                activeArticleList,
                onChange: this.onSelectChange,
            };
        return (
            <div className={ styles.ArticleText }>
                <header style={{ display:edit?'none':'block' }}>
                    <Select value={ searchForm.tableName } style={{ width: 150 }} onChange={ this.articleTextClassChange }>
                        {
                            articleTextClass && articleTextClass.map(item=><Option key={item.name} value={ item.name }> { item.title } </Option>)
                        }
                    </Select>

                    <Button danger disabled={ 0 >= activeArticleList.length  }  icon={<DeleteOutlined />} onClick={ this.deleteArticle } > 批量删除 </Button>
                </header>

                <Table style={{ display:edit?'none':'block' }} bordered rowKey={ row => row.id }  rowSelection={ rowSelection } columns={ columns } dataSource={ activeTextData } pagination={{
                    current:searchForm.page,
                    pageSize:searchForm.pageSize,
                    total:searchForm.total,
                    showTotal:(total) => `共${total}条数据`,
                    onChange : this.handleSizeChange
                }} />
                {
                    edit?<UpdateArticleText { ...editForm } closeEdit = { _=>this.setState({ edit:false }) } />:null
                }
            </div>
        )
    }

    // 渲染完成
    componentDidMount() {
        this.getArticleTextClass()
    }

    // 组件卸载
    componentWillUnmount() {
    }
}

export default withRouter(ArticleText)
