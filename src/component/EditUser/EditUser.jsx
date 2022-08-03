import React, {Component} from 'react';
import { withRouter } from 'react-router-dom';
import {Button, message, Input, Modal, Form, InputNumber, Radio} from 'antd';
import md5 from 'js-md5';

import { register , updateUser , } from '../../api/user';
import userInfo from "../../assets/js/userInfo";
// 验证
import vf from '../../assets/js/verification';


class EditUser extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
    }

    // 弹框的确定事件
    editUserFn = (e)=>{
        let { userForm , closeEditUser } = this.props;
        if( userForm.title === "添加用户" ){
            register(e).then(res=>{
                message.success(res.msg);
                closeEditUser()
            })
        }else{
            e.id = userForm.id;
            e.password = md5(String(e.password));
            updateUser(e).then(res=>{
                message.success(res.msg);
                closeEditUser()
            })
        }
    }

    // 创建form
    formRef = React.createRef();

    render() {
        let { userForm , closeEditUser } = this.props;
        return (
            <Modal
                title={ userForm.title }
                width={'30%'}
                visible={userForm.visible}
                onCancel={closeEditUser}
                footer={[
                    <Button key="back" onClick={closeEditUser}> 取消 </Button>,
                    <Button key="submit" htmlType="submit" type="primary" onClick={ _=>this.formRef.current.submit()}> 提交 </Button>
                ]}
            >
                <Form
                    name="basic"
                    labelCol={{ span: 4, }}
                    wrapperCol={{ span: 20, }}
                    initialValues={ userForm }
                    onFinish={ this.editUserFn }
                    autoComplete="off"
                    ref={this.formRef}
                >
                    <Form.Item
                        label="用户名"
                        name="username"
                        rules={vf.username}
                    >
                        <Input />
                    </Form.Item>
                    {
                        userForm.title === "添加用户"?(
                            <Form.Item
                                label="密码"
                                name="password"
                                rules={vf.pw}
                            >
                                <Input.Password/>
                            </Form.Item>
                        ):""
                    }
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
                        label="广播"
                        name="broadcast"
                    >
                        <Radio.Group >
                            <Radio value={1}>正常</Radio>
                            <Radio value={2}>只读</Radio>
                            <Radio value={3}>禁用</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        label="状态"
                        name="state"
                    >
                        <Radio.Group >
                            {
                                userInfo.userState.map(item=><Radio key={item.value} value={item.value}>{item.label}</Radio>)
                            }
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        label="角色"
                        name="type"
                    >
                        <Radio.Group >
                            {
                                userInfo.userJit.map((item,index)=>{
                                    if( index > 0 ){
                                        let type = userInfo.userInfo.type;
                                        if( type === "superAdmin" ){
                                            return <Radio key={item.value} value={item.value}>{item.label}</Radio>
                                        }else if( type !== "user" ){
                                            if( index > 1 ){
                                                return <Radio key={item.value} value={item.value}>{item.label}</Radio>
                                            }
                                        }
                                    }
                                })
                            }
                        </Radio.Group>
                    </Form.Item>
                </Form>
            </Modal>
        )
    }
}

export default withRouter(EditUser)
