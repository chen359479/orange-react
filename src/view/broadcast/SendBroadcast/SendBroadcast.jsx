import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import { Button, Form, Input , Select , DatePicker , message ,  } from 'antd';
import moment from 'moment';


import ReEditor from '../../../component/ReEditor/ReEditor';
import ve from '../../../assets/js/verification';
import userInfo from "../../../assets/js/userInfo";

import { writeBroadcast } from '../../../api/broadcast'

const { Option } = Select;
class SendBroadcast extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gradeTypeList:[ // 广播消息等级
                {
                    value: 1,
                    label: '高'
                },{
                    value: 2,
                    label: '中'
                },{
                    value: 3,
                    label: '低'
                }
            ],
            content:""
        };
    }

    // 编辑器的ref
    editForm ;

    // 表单成功的回调
    onFinish = e =>{
        let content = this.editForm.state.content;
        if(userInfo.userInfo.broadcast !== 1){
            message.warning('您已被禁用广播功能');
        }else if( !content ){
            message.warning('请填写广播内容');
        }else {
            writeBroadcast({ ...e,content }).then(res=>{
                message.success(res.msg);
            })
        }
    }


    render() {
        let { gradeTypeList } = this.state,
            disabledDate = (current) => {
                return current && current < moment().endOf('day');
            }

        return (
            <div>
                <Form
                    layout="inline"
                    onFinish={ this.onFinish }
                    autoComplete="off"
                    initialValues={{ grade:1 }}
                >
                    <Form.Item
                        label="标题"
                        name="title"
                        rules={ ve.title }
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="等级"
                        name="grade"
                    >
                        <Select style={{width:"100px"}}>
                            {
                                gradeTypeList.map(item=><Option key={item.value} value={ item.value }>{ item.label }</Option>)
                            }
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="过期时间"
                        name="expiration_time"
                        rules={[{ required: true, message: '请选择过期时间' }]}
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
                <ReEditor onRef={ ref=>this.editForm=ref }/>
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

export default withRouter(SendBroadcast)
