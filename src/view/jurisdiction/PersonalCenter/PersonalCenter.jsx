import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import { Button , Form , Radio , InputNumber , Input , message  ,} from 'antd';
import md5 from 'js-md5';
import PubSub from 'pubsub-js'

import styles from './index.module.css';
import userInfo from '../../../assets/js/userInfo';
import { updateUser, updateMePassword } from '../../../api/user';

// 验证
import vf from '../../../assets/js/verification'

class PersonalCenter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menu:0,
            userForm:{ ...userInfo.userInfo }
        };
    }

    // 更改用户信息
    updateUserInfo=  (e)=>{
        let d = { ...this.state.userForm,...e};
        updateUser(d).then(res=>{
            message.success('修改信息成功！');
            userInfo.userInfo  = d;
        })
    }
    // 更新用户密码
    updateUserPassword = (e)=>{
        let d = { id:userInfo.userInfo.id , newPassword : md5(String(e.newPassword))  };
        updateMePassword(d).then(res=>{
            message.success('修改密码成功！');
            PubSub.publish('logout');
        })
    }

    render() {
        let { menu , userForm } = this.state;
        return (
            <div className={styles.PersonalCenter}>
                <div className={styles['left-btn']}>
                    <a onClick={ _=>{this.setState({ menu : 0 })} } className={ menu === 0?styles['active-menu']:'' } >个人信息</a><br/>
                    <a onClick={ _=>{this.setState({ menu : 1 })} } className={ menu === 1?styles['active-menu']:'' }>修改密码</a>
                </div>
                {
                    !menu?(
                        <div className={styles['user-info']} >
                            <Form
                                name="basic"
                                labelCol={{ span: 8, }}
                                wrapperCol={{ span: 16, }}
                                initialValues={ userForm }
                                onFinish={ this.updateUserInfo }
                                autoComplete="off"
                                labelAlign="left"
                            >
                                <Form.Item
                                    label="用户名"
                                    name="username"
                                    rules={vf.username}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    label="手机号"
                                    name="phone"
                                    rules={vf.phone}
                                >
                                    <InputNumber  style={{width:"100%"}} controls={false}/>
                                </Form.Item>

                                <Form.Item
                                    label="性别"
                                    name="sex"
                                >
                                    <Radio.Group >
                                        <Radio value={0}>女</Radio>
                                        <Radio value={1}>男</Radio>
                                    </Radio.Group>
                                </Form.Item>

                                <Form.Item
                                    label="角色"
                                    name="type"
                                >
                                    <span> {userForm.type}</span>
                                </Form.Item>

                                <Form.Item
                                    label="创建时间"
                                    name="created_time"
                                >
                                    <div>{ userForm.created_time }</div>
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                        提交
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    ):(
                        <div className={styles['user-password']}>
                            <Form
                                name="basic"
                                labelCol={{ span: 8, }}
                                wrapperCol={{ span: 16, }}
                                onFinish={ this.updateUserPassword }
                                autoComplete="off"
                                labelAlign="left"
                            >
                                <Form.Item
                                    label="新密码"
                                    name="newPassword"
                                    rules={vf.pw}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    label="确认密码"
                                    name="rePassword"
                                    rules={[
                                        ...vf.pw,
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('newPassword') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('两次密码不一致!'));
                                            },
                                        }),
                                    ]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                        提交
                                    </Button>
                                </Form.Item>
                            </Form>

                        </div>
                    )
                }
            </div>
        )
    }


    // 渲染完成
    componentDidMount() {

    }

    // 组件卸载
    componentWillUnmount() {
    }
}

export default withRouter(PersonalCenter)
