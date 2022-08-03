import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import moment from 'moment';
import { PageHeader , Button } from 'antd';

import  styles from './index.module.css'
class ReadMessage extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        let { msgData , closeRead} = this.props;
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
}

export default withRouter(ReadMessage)
