import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/css/reset.css';
import 'antd/dist/antd.css';
import './assets/iconfont/iconfont.css'
import App from './App';
import reportWebVitals from './assets/js/reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    // 关闭了严格模式，如果开启路由跳转不刷新页面
  //<React.StrictMode>
      <App />
  //</React.StrictMode>
);
reportWebVitals();
