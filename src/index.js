import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import './assets/css/reset.css';
import './assets/iconfont/iconfont.css'
import reportWebVitals from './assets/js/reportWebVitals';
import { AliveScope } from 'react-activation'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    // 关闭了严格模式，如果开启路由跳转不刷新页面
  //<React.StrictMode>
    <AliveScope>
        <App />
    </AliveScope>
  //</React.StrictMode>
);
reportWebVitals();
