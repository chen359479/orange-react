import React, {Component} from 'react';
import { withRouter } from 'react-router-dom';
import { Dropdown, Menu,  Avatar } from 'antd';
import { BellOutlined , SettingOutlined , ImportOutlined , UserOutlined  } from '@ant-design/icons'


import userInfo from "../../assets/js/userInfo";
import styles from './main.module.css';
import logo from '../../assets/image/orange.png';



class Header extends Component {
    state = {
        squareUrl: "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
        notifications: 1,
        pattern: true,
        drawer: false,
    };

    // 退出登录
    logout = ()=>{
        userInfo.userInfo = {};
        userInfo.token = "";
        this.props.history.replace('/login')
    }

    // 个人中心
    goPersonalCenter = ()=>{
        this.props.history.replace('/main/personalCenter')
    }

    menu = (
        <Menu
            items={[
                {
                    key: '1',
                    label: (
                        <a onClick={ this.goPersonalCenter }> <SettingOutlined  /> 个人中心 </a>
                    ),
                },{
                    key: '2',
                    label: (
                        <a onClick={this.logout}> <ImportOutlined /> 退出登录 </a>
                    ),
                },
            ]}
        />
    );

    // getDerivedStateFromProps是一个静态函数，不能使用this,返回null则不更新任何内容
    static getDerivedStateFromProps(nextProps, state) {
        // 可以用来比较即将更新的props和上一个状态的 state
        return nextProps
    }

    render() {
        let { pattern } = this.state;
        return (
            <header className={styles.header}>
                <div className={styles.logo}>
                    <img src={logo} alt="logo"></img>
                </div>
                <div className={styles.pattern} onClick={ _=>{ this.setState({ pattern:!pattern }) }}>
                    {
                        pattern?(
                            <i className="iconfont icon-baitian"  title="亮色模式" />
                        ):(
                            <i className="iconfont icon-heiyemoshi" title="深色模式" />
                        )
                    }
                </div>
                <div>
                    <BellOutlined style={{fontSize:'16px',color:"#666"}} />
                </div>
                <Dropdown overlay={this.menu}>
                    <span style={{ padding:"0 15px" }}>
                        <Avatar style={{top:'-3px'}} icon={<UserOutlined />} />
                        <span style={{margin:'0 8px',fontSize:"16px"}}>{userInfo.userInfo.username}</span>
                    </span>
                </Dropdown>
            </header>
        )
    }

}

export default withRouter(Header)
