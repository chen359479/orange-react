import { useState , useEffect , useRef } from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
import { UserOutlined , LockOutlined , PhoneOutlined } from '@ant-design/icons';

import md5 from 'js-md5';

import userInfo from "@/assets/js/userInfo";
import { login as loginApi} from '@/api/user';
import styles from './login.module.css'

import store from "@/store";

// 验证
import vf from '@/assets/js/verification'

export default (props)=>{
    const [ model ,setModel ] = useState(false)
    const [ formInline ,setFormInline ] = useState({
            username:"",
            password:"",
            phone:"",
            model:true,
            checked:false
        })

    // 创建form
    let formRef = useRef(null);

    // 验证通过，登录的方法
    let onFinish = (f) => {
        let data = {
            ...formInline,
            ...f,
            password:!model?md5(String(f.password)):f.password,
        }
        setFormInline(data)

        loginApi(data).then(res=>{
            if( res.data ){
                if(data.checked){
                    data.time = new Date();
                    localStorage.setItem('userForm',JSON.stringify(data))
                }else  localStorage.removeItem('userForm');

                store.dispatch({ type: "SET_USER_INFO", userInfo : res.data });
                store.dispatch({ type: "SET_TOKEN", token : res.data.token })

                userInfo.userInfo = res.data;
                userInfo.token = res.data.token;
                props.history.replace('/main');
            }
        })
    };

    // 判断上次登录的时间是否超过四天
    let getDays = (startDay, endDay)=>{
        let sd = new Date(startDay).getTime();
        let end = new Date(endDay).getTime();
        return (end-sd)/(1000*60*60*24)
    };

    useEffect(()=>{
        let u = localStorage.getItem('userForm');
        if( u ){
            u = JSON.parse(u);
            if( 4 >= getDays(u.time , new Date() )){
                setModel(true)
                setFormInline(u)

            }else{
                localStorage.removeItem('userForm');
                setModel(false)
            }
        }
    },[])

    return (
        <div className={styles.loginBg} >
            <div className={styles['login-wrap']} key={ formInline.username }>
                <h3> { formInline.model? '账号密码登录':'手机号登录' } </h3>
                <Form
                    name="basic"
                    wrapperCol={{span: 24}}
                    initialValues={ formInline }
                    onFinish={ onFinish }
                    autoComplete="off"
                    ref={ formRef }
                >
                    {
                        formInline.model?
                            (
                                <Form.Item
                                    name="username"
                                    rules={ vf.username }
                                >
                                    <Input onChange={ _=>{ setModel(false) } } prefix={<UserOutlined  style={{ color: '#c0c4cc' }} /> } placeholder="请输入用户名" size="large"/>
                                </Form.Item>
                            ):
                            (
                                <Form.Item
                                    name="phone"
                                    rules={vf.phone}
                                >
                                    <Input onChange={ _=>{ setModel(false) } } prefix={<PhoneOutlined  style={{ color: '#c0c4cc' }} /> } placeholder="请输入手机号" size="large"/>
                                </Form.Item>
                            )
                    }

                    <Form.Item
                        name="password"
                        rules={vf.pw}
                    >
                        <Input.Password onPressEnter={ _=>formRef.current.submit() } onChange={ _=>{ setModel(false) } } prefix={<LockOutlined  style={{ color: '#c0c4cc' }}  />} placeholder="请输入密码" size="large" />
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
                            <Button onClick={ _=>{ setFormInline({ ...formInline, model : !formInline.model }) } } type="link" >{ formInline.model?'手机号登录':'密码登录' }</Button>&nbsp;&nbsp;
                            <Button type="link" danger>忘记密码</Button>
                        </p>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}
