import { useContext } from 'react';
import moment from 'moment';
import { Button } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';

import  styles from './index.module.css'

import MyContext from "@/component/MyContext/MyContext";

export default ()=> {
    const { msgData , closeRead } = useContext(MyContext)
    return (
        <div className={styles['msg-content']} >
            <PageHeader onBack={ closeRead } title={ msgData.title }/>
            <p>
                <Button type="link" danger>广播有效期: { moment(msgData.expiration_time).format('YYYY-MM-DD HH:mm:ss')  }</Button>
                <Button type="text" >{ msgData.grade }</Button>
            </p>
            <div dangerouslySetInnerHTML={{ __html:msgData.content }} />
            <p>
                <Button type="link">{ moment(msgData.created_time).format('YYYY-MM-DD HH:mm:ss') }</Button>
                <Button type="link">{ msgData.username }</Button>
            </p>
        </div>
    )
}
