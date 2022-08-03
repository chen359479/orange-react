import React, {Component} from 'react';
import PubSub from 'pubsub-js'
import { Tabs } from 'antd';
import { Switch , Route , Redirect  } from "react-router-dom";
// main页面
import Header from './Header';
import Menus from "./Menu";
import Home from "../home/Home";
// 权限设置
import SettingMenu from '../jurisdiction/Menus/Menus';
import PersonalCenter from '../jurisdiction/PersonalCenter/PersonalCenter';
import UserManagement from '../jurisdiction/UserManagement/UserManagement';
import WxUser from '../jurisdiction/WxUser/WxUser';
// 广播
import BroadcastMessage from '../broadcast/BroadcastMessage/BroadcastMessage';
import SendBroadcast from '../broadcast/SendBroadcast/SendBroadcast';
// 资源管理
import ArticleInfo from '../article/ArticleInfo/ArticleInfo';
import ArticleText from '../article/ArticleText/ArticleText';

import styles from './main.module.css';

const { TabPane } = Tabs;

export default class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width:'256px',
            panes : [
                {
                    title: '首页',
                    key: '/main/home',
                    closable:false
                }
            ],
            activeKey:'/main/home',
            logout:null,
            changeCollapsed:null,
            changRoute:null
        };
    }

    // 标签页点击事件
    tabClick=(e)=>{
        let { activeKey } = this.state;
        if( activeKey !== e ){
            this.setState({
                activeKey:e
            })
            this.props.history.replace(e);
            PubSub.publish( 'changeTab' , e );
        }
    }

    // 删除标签页
    removeTab=(targetKey, action)=>{
        if( action === 'remove' ){
            let { panes } = this.state;
            let newPanes = panes.filter((item,index)=>{
                if( item.key === targetKey ){
                    let pan = ( panes[index +1] || panes[index -1]);
                    this.props.history.replace(pan.key);
                    PubSub.publish( 'changeTab' , pan.key );
                    this.setState({
                        activeKey : pan.key
                    })
                }else return item;
            })
            this.setState({
                panes : newPanes
            })
        }
    }

    render() {
        let { width , panes , activeKey } = this.state;
        return (
            <div>
                <Header/>
                <div className={styles['main-scrollbar']} >
                    <Menus />
                    <div style={{ paddingLeft: width }} className={styles['main-wrap']}>
                        <Tabs hideAdd  type="editable-card" onChange={ this.tabClick } activeKey={ activeKey } onEdit={ this.removeTab }>
                            {panes.map((pane) => (
                                <TabPane tab={pane.title} key={pane.key} closable={pane.closable} />
                            ))}
                        </Tabs>

                        <div className={ styles['main-content'] }>
                            <Switch>
                                <Route path="/main/home" component={Home} />
                                <Route path="/main/menus" component={SettingMenu} />
                                <Route path="/main/personalCenter" component={PersonalCenter} />
                                <Route path="/main/userManagement" component={UserManagement} />
                                <Route path="/main/wxUser" component={WxUser} />
                                <Route path="/main/broadcastMessage" component={BroadcastMessage} />
                                <Route path="/main/sendBroadcast" component={SendBroadcast} />
                                <Route path="/main/articleInfo" component={ArticleInfo} />
                                <Route path="/main/articleText" component={ArticleText} />
                                <Route exact path="/main" render={() => <Redirect to="/main/home" push />} />
                            </Switch>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // 渲染完成
    componentDidMount() {
        // 监听退出事件
        let logout =  PubSub.subscribe('logout',_=>{
            this.props.history.replace('/login');
        })

        // 监听左侧导航栏宽度改变事件
        let changeCollapsed =  PubSub.subscribe('changeCollapsed',(_,d)=>{
            this.setState({ width:d })
        })
        // 监听左侧导航栏点击事件
        let changRoute = PubSub.subscribe('changRoute',(_,data)=>{
            let {  panes , activeKey } = this.state;
            if( activeKey !== data.path ){
                if( panes.some(item=>data.path === item.key) ){

                    this.setState({
                        activeKey:data.path
                    })

                }else {
                    this.setState({
                        panes:panes.concat([{
                            title: data.label,
                            key: data.path,
                            closable:true
                        }]),
                        activeKey:data.path
                    })
                }
            }
        })
        this.setState({
            logout,
            changeCollapsed,
            changRoute
        })
    }

    componentWillUnmount() {
        let { logout , changeCollapsed , changRoute } = this.state;
        logout();
        changeCollapsed();
        changRoute();
    }
}
