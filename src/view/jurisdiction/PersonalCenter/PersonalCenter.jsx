import { useState } from 'react';
import { Button , Form , Radio , InputNumber , Input , message  ,} from 'antd';
import md5 from 'js-md5';
import PubSub from 'pubsub-js'

import styles from './index.module.css';
import store from "@/store";
import { updateUser, updateMePassword } from '@/api/user';

// 验证
import vf from '@/assets/js/verification'

export default () => {
    const { userInfo } =  store.getState().user;
    const [ menu ,setMenu ] = useState(0);
    const [ userForm ] = useState({ ...userInfo })

    // 更改用户信息
    let updateUserInfo=  (e)=>{
        let d = { ...userForm, ...e};
        updateUser(d).then(res=>{
            message.success('修改信息成功！');
            store.dispatch({ type: "SET_USER_INFO", userInfo : d });
        })
    }
    // 更新用户密码
    let updateUserPassword = (e)=>{
        let d = { id:userInfo.id , newPassword : md5(String(e.newPassword))  };
        updateMePassword(d).then(res=>{
            message.success('修改密码成功！');
            PubSub.publish('logout');
        })
    }

    return (
        <div className={styles.PersonalCenter}>
            <div className={styles['left-btn']}>
                <a onClick={ _=>{ setMenu(0) }} className={ menu === 0?styles['active-menu']:'' } >个人信息</a><br/>
                <a onClick={ _=>{ setMenu(1) }} className={ menu === 1?styles['active-menu']:'' }>修改密码</a>
            </div>
            {
                !menu?(
                    <div className={styles['user-info']} >
                        <Form
                            name="basic"
                            labelCol={{ span: 8, }}
                            wrapperCol={{ span: 16, }}
                            initialValues={ userForm }
                            onFinish={ updateUserInfo }
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
                            onFinish={ updateUserPassword }
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
