import { useState , useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Dropdown,  Avatar } from 'antd';
import { SettingOutlined , LogoutOutlined , UserOutlined , ShrinkOutlined , ArrowsAltOutlined , GithubOutlined  } from '@ant-design/icons';
import store from "@/store";
import PubSub from 'pubsub-js';

import styles from './main.module.css';
import logo from '@/assets/image/orange.png';

let Header = (props)=>{
    const [ pattern , setPattern ] = useState(true);
    const [ fullScreen, setFullScreen ] = useState(false);
    const { userInfo } = store.getState().user;
    // 退出登录
    let logout = ()=>{
        store.dispatch({ type: "SET_USER_INFO", userInfo : {} });
        store.dispatch({ type: "SET_TOKEN", token : '' })
        props.history.replace('/login')
    }

    // 个人中心
    let goPersonalCenter = ()=>{
        props.history.replace('/main/personalCenter')
    }

    // 全屏
    let shrink = ()=>{
        const targetElement = document.documentElement;
        if (targetElement.requestFullscreen) {
            targetElement.requestFullscreen();
        } else if (targetElement.mozRequestFullScreen) {
            targetElement.mozRequestFullScreen(); // Firefox
        } else if (targetElement.webkitRequestFullscreen) {
            targetElement.webkitRequestFullscreen(); // Chrome, Safari and Opera
        } else if (targetElement.msRequestFullscreen) {
            targetElement.msRequestFullscreen(); // Internet Explorer and Edge
        }
        setFullScreen(true)
    }
    // 退出全屏
    let exitFullscreen = ()=> {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen(); // Firefox
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen(); // Chrome, Safari and Opera
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen(); // Internet Explorer and Edge
        }
        setFullScreen(false)
    }

    // 打开github连接
    let openGithub = ()=>{
        window.open('https://github.com/chen359479')
    }

    useEffect(()=>{
        PubSub.publish('patternChange',pattern);
    }, [ pattern ] )

    const items = [
        {
            key: '1',
            label: (
                <a onClick={ _=>goPersonalCenter() }> 个人中心 </a>
            ),
            icon: <SettingOutlined />
        },{
            key: '2',
            label: (
                <a onClick={ _=>logout() }> 退出登录 </a>
            ),
            icon: <LogoutOutlined />
        },
    ]

    return (
        <header id={'mainHeader'} className={styles.header}>
            <div className={styles.logo}>
                <img src={logo} alt="logo"/>
            </div>
            <div className={styles.pattern} onClick={ _=>{ setPattern(!pattern) }}>
                {
                    !pattern?(
                        <i className="iconfont icon-baitian" title="亮色模式" />
                    ):(
                        <i className="iconfont icon-heiyemoshi"  title="深色模式" />
                    )
                }
            </div>
            <div>
                {
                    fullScreen?
                        <ShrinkOutlined title={ "退出全屏" } onClick={ exitFullscreen } />:
                        <ArrowsAltOutlined title={ "全屏模式" } onClick={ shrink } />
                }
            </div>
            <div>
                <GithubOutlined title={"github:chen359479"} onClick={ openGithub }/>
            </div>
            <Dropdown menu={{ items }}>
                    <span style={{ padding:"0 15px" }}>
                        <Avatar style={{top:'-3px'}} icon={<UserOutlined />} />
                        <span style={{ margin:'0 8px',fontSize:"16px"}}>{userInfo?.username}</span>
                    </span>
            </Dropdown>
        </header>
    )

}

export default withRouter(Header)
