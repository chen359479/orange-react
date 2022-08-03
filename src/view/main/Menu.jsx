import React, {Component} from 'react';
import { withRouter } from 'react-router-dom';
import { Menu } from 'antd';
import PubSub from 'pubsub-js'
import {
    DoubleLeftOutlined,
    DoubleRightOutlined
} from '@ant-design/icons';

import { getMenuList } from '../../api/menus';
import styles from './main.module.css'

// 创建menus
let getItem = (label, key, icon, children, type,path)=>{
    return {
        key,
        icon,
        children,
        label,
        type,
        path
    };
}

class Menus extends Component {

    constructor(props) {
        super(props);
        this.state = {
            collapsed : false,
            items : [],
            width:'256px',
            routeList:[],
            selectedKeys:['25'],
            changeTab:null
        };
    }

    // 改变菜单栏宽度
    changeCollapsed = ( bool , width )=>{
        PubSub.publish( 'changeCollapsed' , width );
        this.setState({
            collapsed:bool,
            width
        })
    }

    // 左侧菜单栏点击事件
    changRoute=(e)=>{
        let p = this.state.routeList.filter(item=>item.key == e.key)[0];
        this.setState({
            selectedKeys:[String(p.key)]
        })
        this.props.history.push(p.path);
        PubSub.publish( 'changRoute' , p );
    }

    render() {
        let { collapsed , items , width , selectedKeys } = this.state;
        return (
            <div className={styles['menu-wrap']} style={{ width }}>
                <Menu
                    style={{ height: 'calc(100vh - 46px - 38px)'}}
                    defaultSelectedKeys={['25']}
                    mode="inline"
                    theme="light"
                    inlineCollapsed={collapsed}
                    items={items}
                    onClick={this.changRoute}
                    selectedKeys={ selectedKeys }
                />

                    {
                        !collapsed?(
                            <div style={{width}} className={styles['Sidebar-Expand']} onClick={   _=>{this.changeCollapsed(true,'80px')} }>
                                <DoubleLeftOutlined/> <span> 收起侧边栏 </span>
                            </div>
                        ):(
                            <div style={{width}} className={styles['Sidebar-Expand']} onClick={ _=>{this.changeCollapsed(false,'256px')} }>
                                <DoubleRightOutlined />
                            </div>
                        )
                    }
            </div>
        )
    }

    // 获取菜单列表
    getMenuList = ()=>{
        getMenuList().then(res=>{
            let kr = res.data.map(items=>{
                return items.map(k=>{
                    if( k && k.type ){
                        return getItem( k.title , k.id , null , null , undefined , k.viewPath )
                    }else {
                        return getItem( k.title , k.id , null , k.children , undefined , k.viewPath )
                    }

                })
            })
            this.setState({
                routeList : [].concat(kr[0],kr[1],kr[2])
            });

            kr[1].forEach(item=>{
                if( item.children ) {
                    let childrens = JSON.parse(item.children);
                    item.children = childrens.length ? kr[2].filter(k => childrens.includes(k.key)) : [];
                }
            })
            kr[0].forEach(item=>{
                if( item.children ){
                    let childrens = JSON.parse(item.children);
                    item.children = childrens.length?kr[1].filter(k =>childrens.includes(k.key)):[];
                }
            })
            this.setState({ items : kr[0] })
        })
    }

    // 渲染完成
    componentDidMount() {
        this.getMenuList()
        // 监听退出事件
        let changeTab = PubSub.subscribe('changeTab',(_,d)=>{
            let { routeList } = this.state;
            let obj = routeList.filter(item=>item.path === d)[0];
            this.setState({
                selectedKeys:[String(obj.key)]
            })
        })
        this.setState({
            changeTab
        })
    }

    componentWillUnmount() {
        let { changeTab } = this.state;
        changeTab();
    }
}

export default withRouter(Menus)

