import {HashRouter , Route , Redirect } from "react-router-dom";
import { useState } from 'react';
import { ConfigProvider , theme  } from 'antd';
import zhCN from "antd/es/locale/zh_CN";

import Login from './view/login/Login'
import Main from './view/main/Index'

import PubSub from 'pubsub-js';

export default () =>{
    const [ algorithm , setAlgorithm ] = useState(true);

    PubSub.unsubscribe('patternChange');
    PubSub.subscribe('patternChange',(_,d)=>{
        setAlgorithm(d)
        document.body.style.backgroundColor = d?'#fff':'#141414';
        document.body.style.color = d?'rgba(0, 0, 0, 0.88)':'rgba(255, 255, 255, 0.85)';
        document.getElementById('mainHeader').style.borderBottom = d? '1px solid #f0f0f0' : '1px solid #303030';
        document.getElementById('sidebarExpand').style.border = d? '1px solid #f0f0f0' : '1px solid #303030';
    })

    return (
        <ConfigProvider
            theme={{
              algorithm: algorithm?theme.defaultAlgorithm:theme.darkAlgorithm
            }}
            locale={zhCN}>
            <HashRouter >
                <Route path="/login" component={Login}/>
                <Route path="/main" component={Main}/>
                <Route exact path="/" render={() => <Redirect to="/login" push />} />
            </HashRouter >
        </ConfigProvider>
    );
}
