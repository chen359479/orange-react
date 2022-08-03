import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Card , Button , message , Modal  } from 'antd';

import { getMenuList , deleteMenu  } from '../../../api/menus';

import styles from './index.module.css'

const { confirm } = Modal;
class LeftCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allMenuList:[],
            startMenuForm:{
                viewPath:"",
                name:"",
                title:"",
                sequence:99,
                children:[],
                icon:"",
                astrict:['user'],
                type:true,
                msg:''
            }
        };
    }

    // 获取分类的菜单
    getMenuList = _=>{
        getMenuList().then(res=>{
            this.setState({
                allMenuList:res.data
            },this.forceUpdate)
        })
    }

    // 新增菜单
    addMenuForm = index =>{
        let { startMenuForm } = this.state;
        startMenuForm.hierarchy = index + 1;
        switch (startMenuForm.hierarchy){
            case 1:
                startMenuForm.msg = '添加顶级菜单';
                break
            case 2:
                startMenuForm.msg = '添加二级菜单';
                break
            case 3:
                startMenuForm.msg = '添加三级菜单';
                break
        }
        this.props.editMenu( startMenuForm )

    }

    // 更新菜单
    updateMenuForm = data=>{
        this.props.editMenu( { ...data,children:JSON.parse(data.children),astrict:JSON.parse(data.astrict),msg:'修改菜单：'+ data.title } )
    }

    // 删除菜单
    deleteMenu = id=>{
        let that = this;
        confirm({
            title: '确定删除当前菜单吗?',
            icon: <ExclamationCircleOutlined />,
            content: '此操作不可逆，请谨慎操作！',
            cancelText:'取消',
            okText:'确定',
            onOk() {
                deleteMenu({id}).then(res=>{
                    message.success(res.msg);
                    that.getMenuList()
                })
            },
        });
    }

    render() {
        let { allMenuList } = this.state,
            titleList = [ "顶级菜单","二级菜单","三级菜单" ]
        return (
            <div style={{ height : "calc(100vh - 56px - 40px - 10px)",overflow:"hidden auto" }}>
                {
                    allMenuList.length && allMenuList.map((item,index)=>{
                        return (
                            <Card
                                key={ index }
                                title={ titleList[index] }
                                extra={<Button type="link" onClick={ _=>this.addMenuForm(index) }>添加菜单</Button>}
                                style={{ marginBottom:"20px" }}
                            >
                                {
                                    item.map( i =>{
                                        return (
                                            <div className={ styles.link } key={ i.id }>
                                                <Button
                                                    type={i.conclude?'text':'link'}
                                                    title={i.conclude?'已被纳入上级菜单中':'未被纳入上级菜单中'}
                                                    onClick={ _=>this.updateMenuForm(i) }
                                                >
                                                    { i.title }
                                                </Button>
                                                <Button style={{ display : i.name !== 'home'?'block':'none' }} type="link" danger onClick={ _=>{ this.deleteMenu(i.id) } }>
                                                    删除
                                                </Button>
                                            </div>
                                        )
                                    })
                                }
                            </Card>
                        )
                    })
                }
            </div>
        )
    }

    // 渲染完成
    componentDidMount() {
        this.getMenuList();
        this.addMenuForm(0)
    }

    // 组件卸载
    componentWillUnmount() {
    }
}

export default withRouter(LeftCard)
