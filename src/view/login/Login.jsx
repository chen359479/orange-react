import React, { Component } from 'react'
import { Button, Checkbox, Form, Input } from 'antd';
import { UserOutlined , LockOutlined , PhoneOutlined } from '@ant-design/icons';

import md5 from 'js-md5';

import userInfo from "../../assets/js/userInfo";
import { login as loginApi} from '../../api/user';
import styles from './login.module.css'

// 验证
import vf from '../../assets/js/verification'

class Login extends Component{

    state = {
        model : false,
        formInline :{
            username:"",
            password:"",
            phone:"",
            model:true,
            checked:false
        }
    }

    // 验证通过，登录的方法
    onFinish = (f) => {
        let data = {
            ...this.state.formInline,
            ...f,
            password:!this.state.model?md5(String(f.password)):f.password,
        }
        this.setState({ formInline:{ ...data }})

        loginApi(data).then(res=>{
            if(data.checked){
                data.time = new Date();
                localStorage.setItem('userForm',JSON.stringify(data))
            }else  localStorage.removeItem('userForm');

            userInfo.userInfo = res.data;
            userInfo.token = res.data.token;
            this.props.history.replace('/main');
        })
    };

    // 判断上次登录的时间是否超过四天
    getDays = (startDay, endDay)=>{
        let sd = new Date(startDay).getTime();
        let end = new Date(endDay).getTime();
        return (end-sd)/(1000*60*60*24)
    };

    componentWillMount(){
        let u = localStorage.getItem('userForm');
        if( u ){
            u = JSON.parse(u);
            if( 4 >= this.getDays(u.time , new Date() )){
                this.setState({ formInline:u, model : true });
            }else{
                localStorage.removeItem('userForm');
                this.setState({ model : false } )
            }
        }
    }

    // 创建form
    formRef = React.createRef();

    render() {
        return (
            <div className={styles.loginBg} >
                <div className={styles['login-wrap']}>
                    <h3> { this.state.formInline.model? '账号密码登录':'手机号登录' } </h3>
                    <Form
                        name="basic"
                        wrapperCol={{span: 24}}
                        initialValues={this.state.formInline}
                        onFinish={this.onFinish}
                        autoComplete="off"
                        ref={this.formRef}
                    >
                        {
                            this.state.formInline.model?
                                (
                                    <Form.Item
                                        name="username"
                                        rules={ vf.username }
                                    >
                                        <Input onChange={ _=>{ this.setState({ model : false }) } } prefix={<UserOutlined  style={{ color: '#c0c4cc' }} /> } placeholder="请输入用户名" size="large"/>
                                    </Form.Item>
                                ):
                                (
                                    <Form.Item
                                        name="phone"
                                        rules={vf.phone}
                                    >
                                        <Input onChange={ _=>{ this.setState({ model : false }) } } prefix={<PhoneOutlined  style={{ color: '#c0c4cc' }} /> } placeholder="请输入手机号" size="large"/>
                                    </Form.Item>
                                )
                        }

                        <Form.Item
                            name="password"
                            rules={vf.pw}
                        >
                            <Input.Password onPressEnter={ _=>this.formRef.current.submit() } onChange={ _=>{ this.setState({ model : false }) } } prefix={<LockOutlined  style={{ color: '#c0c4cc' }}  />} placeholder="请输入密码" size="large" />
                        </Form.Item>

                        <Form.Item
                            name="checked"
                            valuePropName="checked"
                        >
                            <Checkbox style={{ color:'#fff' }}>记住密码</Checkbox>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" size="large" htmlType="submit" block={true}>
                                登 录
                            </Button>
                        </Form.Item>
                        <Form.Item>
                            <p style={{textAlign:"right"}}>
                                <Button onClick={ _=>{ this.setState({ formInline:{ ...this.state.formInline,model:!this.state.formInline.model  } } ) } } type="link" >{ this.state.formInline.model?'手机号登录':'密码登录' }</Button>&nbsp;&nbsp;
                                <Button type="link" danger>忘记密码</Button>
                            </p>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        )
    }



}



export  default  Login
