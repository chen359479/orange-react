import React from 'react';
import {Redirect, Route, Switch } from 'react-router-dom';
import KeepAlive from 'react-activation'

import Home from "../view/home/Home";
import SettingMenu from "../view/jurisdiction/Menus/Menus";
import PersonalCenter from "../view/jurisdiction/PersonalCenter/PersonalCenter";
import UserManagement from "../view/jurisdiction/UserManagement/UserManagement";
import WxUser from "../view/jurisdiction/WxUser/WxUser";
import BroadcastMessage from "../view/broadcast/BroadcastMessage/BroadcastMessage";
import SendBroadcast from "../view/broadcast/SendBroadcast/SendBroadcast";
import ArticleInfo from "../view/article/ArticleInfo/ArticleInfo";
import ArticleText from "../view/article/ArticleText/ArticleText";
import Order from "../view/order/Index";
import DocumentCom from "../view/document/Index";
import ClassSet from "../view/jurisdiction/ClassSet/Index";
import Car from '../view/car/carOrder/Index';
import CarInfo from '../view/car/carManage/Index';

let keepHome = ()=>(<KeepAlive name={'home'} path="/main/home"><Home/></KeepAlive>);
let keepSettingMenu = ()=>(<KeepAlive name={'SettingMenu'} path="/main/menus"><SettingMenu/></KeepAlive>);
let keepPersonalCenter = ()=>(<KeepAlive name={'PersonalCenter'} path="/main/personalCenter"><PersonalCenter/></KeepAlive>);
let keepUserManagement = ()=>(<KeepAlive name={'UserManagement'} path="/main/userManagement"><UserManagement/></KeepAlive>);
let keepWxUser = ()=>(<KeepAlive name={'WxUser'} path="/main/wxUser"><WxUser/></KeepAlive>);
let keepBroadcastMessage = ()=>(<KeepAlive name={'BroadcastMessage'} path="/main/broadcastMessage"><BroadcastMessage/></KeepAlive>);
let keepSendBroadcast = ()=>(<KeepAlive name={'SendBroadcast'} path="/main/sendBroadcast"><SendBroadcast/></KeepAlive>);
let keepArticleInfo = ()=>(<KeepAlive name={'ArticleInfo'} path="/main/articleInfo"><ArticleInfo/></KeepAlive>);
let keepArticleText = ()=>(<KeepAlive name={'keepArticleText'} path="/main/articleText"><ArticleText/></KeepAlive>);
let keepOrder = ()=>(<KeepAlive name={'Order'} path="/main/order"><Order/></KeepAlive>);
let keepDocumentCom = ()=>(<KeepAlive name={'DocumentCom'} path="/main/document"><DocumentCom/></KeepAlive>);
let keepClassSet = ()=>(<KeepAlive name={'ClassSet'} path="/main/classSet"><ClassSet/></KeepAlive>);
let keepCar = ()=>(<KeepAlive name={'Car'} path="/main/carOrder"><Car/></KeepAlive>);
let keepCarInfo = ()=>(<KeepAlive name={'CarInfo'} path="/main/carInfo"><CarInfo/></KeepAlive>);

export default ()=>{
    return (
        <Switch>
            <Route path="/main/home" component={ keepHome } />
            <Route path="/main/menus" component={ keepSettingMenu } />
            <Route path="/main/personalCenter" component={keepPersonalCenter} />
            <Route path="/main/userManagement" component={keepUserManagement} />
            <Route path="/main/wxUser" component={keepWxUser} />
            <Route path="/main/broadcastMessage" component={keepBroadcastMessage} />
            <Route path="/main/sendBroadcast" component={keepSendBroadcast} />
            <Route path="/main/articleInfo" component={keepArticleInfo} />
            <Route path="/main/articleText" component={keepArticleText} />
            <Route path="/main/order" component={keepOrder} />
            <Route path="/main/document" component={ keepDocumentCom } />
            <Route path="/main/classSet" component={ keepClassSet } />
            <Route path="/main/carOrder" component={ keepCar } />
            <Route path="/main/carInfo" component={ keepCarInfo } />
            <Route exact path="/main" render={() => <Redirect to="/main/home" push />} />
        </Switch>
    )
}
