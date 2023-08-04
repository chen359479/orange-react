import { useState , useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Menu } from 'antd';
import PubSub from 'pubsub-js'
import {
    DoubleLeftOutlined,
    DoubleRightOutlined
} from '@ant-design/icons';

import Icon from '@ant-design/icons'
import * as icons from '@ant-design/icons'

import { getMenuList as getMenuListApi } from '@/api/menus';
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

let Menus = ( props )=> {
    const [ collapsed , setCollapsed ] = useState(false);
    const [ items , setItems ] = useState([]);
    const [ routeList , setRouteList ] = useState([]);
    const [ width , setWidth ] = useState('256px');
    const [ selectedKeys , setSelectedKeys ] = useState(['25']);
    // 改变菜单栏宽度
    let changeCollapsed = ( bool , width )=>{
        PubSub.publish( 'changeCollapsed' , width );
        setCollapsed(bool);
        setWidth(width);
    }

    // 左侧菜单栏点击事件
    let changRoute = ( e )=>{
        let p = routeList.filter(item=>String(item.key) === String(e.key))[0];
        setSelectedKeys([String(p.key)])
        props.history.push(p.path);
        PubSub.publish( 'changRoute' , p );
    }

    // 获取菜单列表
    let getMenuList = ()=>{
        getMenuListApi().then(res=>{
            let kr = res.data.map(items=>{
                return items.map(k=>{
                    let icon = k.hierarchy === 1 ? <Icon component={icons[k.icon]}/> : null;
                    if( k && k.type ){
                        return getItem( k.title , k.id , icon , null , undefined , k.viewPath )
                    }else {
                        return getItem( k.title , k.id , icon , k.children , undefined , k.viewPath )
                    }
                })
            })
            setRouteList([].concat(kr[0],kr[1],kr[2]))

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
            setItems( kr[0] )
        })
    }

    // 监听标签栏切换事件
    PubSub.unsubscribe('changeTab');
    PubSub.subscribe('changeTab',(_,d)=>{
        let obj = routeList.filter(item=>item.path === d)[0];
        setSelectedKeys([String(obj.key)])
    })

    // 获取列表数据
    useEffect(()=>{
        getMenuList();
    },[ ])

    return (
        <div className={ styles['menuWrap'] } style={{ width }}>
            <Menu
                style={{ height: 'calc(100vh - 46px - 38px)'}}
                defaultSelectedKeys={['25']}
                mode="inline"
                theme="light"
                inlineCollapsed={ collapsed }
                items={ items }
                onClick={ changRoute }
                selectedKeys={ selectedKeys }
            />
            {
                !collapsed?(
                    <div style={{width }} id={'sidebarExpand'} className={styles['sidebarExpand']} onClick={   _=>{changeCollapsed(true,'80px')} }>
                        <DoubleLeftOutlined/> <span> 收起侧边栏 </span>
                    </div>
                ):(
                    <div style={{width }} id={'sidebarExpand'} className={styles['sidebarExpand']} onClick={ _=>{changeCollapsed(false,'256px')} }>
                        <DoubleRightOutlined />
                    </div>
                )
            }
        </div>
    )
}

export default withRouter(Menus)

