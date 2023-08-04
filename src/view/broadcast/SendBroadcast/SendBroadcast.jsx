import { useState } from 'react';
import { Button, Form, Input , Select , DatePicker , message ,  } from 'antd';
import moment from 'moment';

import { writeBroadcast } from '@/api/broadcast';

import store from "@/store";
import verification from '@/assets/js/verification';
import { gradeTypeList } from '@/assets/js/public';

import MyContext from "@/component/MyContext/MyContext";
import ReEditor from '@/component/ReEditor/ReEditor';

const { Option } = Select;

export default (props)=> {

    const { requiredObj , title } = verification;
    const [ content , setContent ] = useState('');
    const { userInfo } = store.getState().user;

    // 表单成功的回调
    let onFinish = e =>{
        if(userInfo.broadcast !== 1){
            message.warning('您已被禁用广播功能');
        }else if( !content ){
            message.warning('请填写广播内容');
        }else {
            writeBroadcast({ ...e,content }).then(res=>{
                message.success(res.msg);
                props.history.push('/main/broadcastMessage')
            })
        }
    }

    const disabledDate = (current) => {
        return current && current < moment().endOf('day');
    }

    return (
        <div>
            <Form
                layout="inline"
                onFinish={ onFinish }
                autoComplete="off"
                initialValues={{ grade:1 }}
            >
                <Form.Item
                    label="标题"
                    name="title"
                    rules={ title }
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="等级"
                    name="grade"
                >
                    <Select style={{width:"100px"}}>
                        {
                            gradeTypeList.map(item=>{
                               return  item.value !== 0?<Option key={item.value} value={ item.value }>{ item.label }</Option>:null
                            })
                        }
                    </Select>
                </Form.Item>

                <Form.Item
                    label="过期时间"
                    name="expiration_time"
                    rules={ requiredObj }
                >
                    <DatePicker
                        format="YYYY-MM-DD HH:mm:ss"
                        disabledDate={ disabledDate }
                        placeholder={"请选择过期时间"}
                    />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        发布
                    </Button>
                </Form.Item>
            </Form>
            <MyContext.Provider value={{ initialValue : '', reEditorChange : e=>{ setContent( e ) }  }}>
                <ReEditor />
            </MyContext.Provider>

        </div>
    )
}
