import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {Button, message, Input, Modal, Form} from 'antd';
import md5 from 'js-md5';

// user接口
import {  updateUserPassword   } from '../../api/user';
// 验证
import vf from '../../assets/js/verification'

class UpdateUserPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    // 创建form
    formRef = React.createRef();

    // 更新用户密码
    updateUserPassword = (e)=>{
        let { id , closeUpdateUserPassword } = this.props,
            data = {
                adminPassword : md5(String(e.adminPassword)),
                newPassword : md5(String(e.newPassword)),
                id
            };
        updateUserPassword(data).then(res=>{
            closeUpdateUserPassword();
            message.success(res.msg);
        })
    }

    render() {
        let { visible ,  closeUpdateUserPassword  } = this.props;
        return (
            <Modal
                title="修改用户密码"
                visible={ visible }
                onCancel={ closeUpdateUserPassword }
                footer={[
                    <Button key="back" onClick={closeUpdateUserPassword}> 取消 </Button>,
                    <Button key="submit" htmlType="submit" type="primary" onClick={ _=>this.formRef.current.submit()}> 提交 </Button>
                ]}
            >
                <Form
                    name="updateUserPassword"
                    labelCol={{span: 5,}}
                    wrapperCol={{span: 19,}}
                    onFinish={ this.updateUserPassword }
                    autoComplete="off"
                    ref={this.formRef}
                >
                    <Form.Item
                        label="管理员密码"
                        name="adminPassword"
                        rules={ vf.pw }
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        label="新密码"
                        name="newPassword"
                        rules={ vf.pw }
                    >
                        <Input.Password />
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
                        <Input.Password />
                    </Form.Item>
                </Form>
            </Modal>
        )
    }

    // 渲染完成
    componentDidMount() {

    }

    // 组件卸载
    componentWillUnmount() {
    }
}

export default withRouter(UpdateUserPassword)
