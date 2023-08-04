import { useState  } from 'react';
import PubSub from 'pubsub-js'
import { Tabs } from 'antd';
import { useAliveController } from 'react-activation'

// main页面
import Header from './Header';
import Menus from "./Menu";

import Router from "@/router/Router";

import styles from './main.module.css';

export default (props)=> {
    const { drop, getCachingNodes } = useAliveController()
    const [ width , setWidth ] = useState('256px');
    const [ activeKey , setActiveKey ] = useState('/main/home');
    const [ panes , setPanes ] = useState([
        {
            title: '首页',
            key: '/main/home',
            closable:false
        }
    ])

    // 标签页点击事件
    let tabClick = (e)=>{
        if( activeKey !== e ){
            setActiveKey(e)
            props.history.replace(e);
            PubSub.publish( 'changeTab' , e );
        }
    }

    // 删除标签页
    let removeTab = (targetKey, action)=>{
        if( action === 'remove' ){
            let newPanes = panes.filter((item,index)=>{
                if( item.key === targetKey ){
                    // 删除节点时从缓存中删除
                    let cachingNodes = getCachingNodes();
                    let nodes = cachingNodes.filter(item=>item.path === targetKey)[0];
                    if(nodes)drop(nodes.name)

                    let pan = ( panes[index +1] || panes[index -1]);
                    props.history.replace(pan.key);
                    PubSub.publish( 'changeTab' , pan.key );
                    setActiveKey(pan.key)
                }else return item;
            })
            setPanes(newPanes)
        }
    }
    // 监听退出事件
    PubSub.unsubscribe('logout');
    PubSub.subscribe('logout',_=>{
        props.history.replace('/login');
    })

    // 监听左侧导航栏宽度改变事件
    PubSub.unsubscribe('changeCollapsed');
    PubSub.subscribe('changeCollapsed',(_,d)=>{
        setWidth(d)
    })

    // 监听左侧导航栏宽度改变事件
    PubSub.unsubscribe('changRoute');
    PubSub.subscribe( 'changRoute' , ( _ ,data ) =>{
        if( activeKey !== data.path ){
            if( !panes.some( item => data.path === item.key) ){
                let arr  = panes.concat(
                    [{
                        title: data.label,
                        key: data.path,
                        closable:true
                    }]
                )
                setPanes(arr)
            }
            setActiveKey(data.path)
        }
    })

    return (
        <div>
            <Header/>
            <div className={styles['mainScrollbar']} >
                <Menus />
                <div style={{ paddingLeft: width }} className={styles['mainWrap']}>
                    <Tabs hideAdd type="editable-card" onChange={ tabClick } activeKey={ activeKey } onEdit={ removeTab } items={
                        panes.map(item=>{
                            return {
                                label: item.title,
                                key: item.key,
                                closable:item.closable
                            }
                        })
                    } />

                    <div className={ styles['mainContent'] }>
                        <Router/>
                    </div>
                </div>
            </div>
        </div>
    )
}
