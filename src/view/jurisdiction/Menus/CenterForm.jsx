import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import { Card , Button, Checkbox, Form, Input , InputNumber , Switch , Select , message  } from 'antd';

import { getCanAddSubset  , updateMenus , writeMenus   } from '../../../api/menus';
import styles from './index.module.css';
import userInfo from '../../../assets/js/userInfo';
import vf from "../../../assets/js/verification";

const { Option } = Select;
class CenterForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            canSubset : [],
            menuForm:{},
            type:true
        };
    }

    // 表单验证成功后的回调
    onFinish = e=>{
        let { menuForm } = this.state;
        e.hierarchy = menuForm.hierarchy;

        if( menuForm.id ){
            e.id = menuForm.id;
            updateMenus(e).then(res=>{
                message.success(res.msg);
            })
        }else {
            writeMenus(e).then(res=>{
                message.success(res.msg);
            })
        }

    }

    // 获取可添加的菜单
    getCanAddSubset = index =>{
        let { menuForm } = this.state;
        let d = {
            hierarchy : menuForm.hierarchy,
            children : JSON.stringify(menuForm.children)
        };
        if(d.hierarchy === 3){
            this.setState({
                canSubset : []
            })
        }else {
            getCanAddSubset(d).then(res=>{
                this.setState({
                    canSubset : res.data
                })
            });
        }
    }

    render() {
        let { menuForm , canSubset , type } = this.state;
        return (
            <Card>
                <Form
                    name="basic"
                    labelCol={{ span: 4, }}
                    wrapperCol={{ span: 20, }}
                    initialValues={ menuForm }
                    onFinish={ this.onFinish }
                    autoComplete="off"
                    key={ menuForm.msg }
                >
                    <h2 className={ styles.h2 }> { menuForm.msg } </h2>
                    <Form.Item
                        label="菜单路径"
                        name="viewPath"
                        rules={ vf.viewPath }
                    >
                        <Input  size="large" placeholder="页面路径"/>
                    </Form.Item>
                    <Form.Item
                        label="组件名称"
                        name="name"
                        rules={ vf.name }
                    >
                        <Input  size="large" placeholder="组件名称"/>
                    </Form.Item>
                    <Form.Item
                        label="菜单名称"
                        name="title"
                        rules={ vf.viewTitle }
                    >
                        <Input  size="large" placeholder="菜单名称"/>
                    </Form.Item>
                    <Form.Item
                        label="排序"
                        name="sequence"
                    >
                        <InputNumber  size="large" controls={false} style={{ width:"100%" }} placeholder="请输入数字，数字越小排序越靠前"/>
                    </Form.Item>
                    <Form.Item
                        label="菜单类型"
                        name="type"
                    >
                        <Switch size="large"
                                disabled={ menuForm.hierarchy === 3 }
                                onChange={ e=>this.setState({ type : e }) }
                                checkedChildren="页面"
                                unCheckedChildren="菜单"
                                defaultChecked={ type }
                        />
                    </Form.Item>
                    {
                        !type?(
                            <Form.Item
                                label="子集"
                                name="children"
                                key={ type }
                                rules={ [ { required: true, message: '请输入排列序号', trigger: 'blur' }, ] }
                            >
                                <Select
                                    mode="multiple"
                                    placeholder="请选择子集"
                                    size="large"
                                >
                                    {
                                        canSubset.map(item=>{
                                            return (
                                                <Option key={item.id} value={ item.id }>{item.title}</Option>
                                            )
                                        })
                                    }
                                </Select>
                            </Form.Item>
                        ):null
                    }
                    <Form.Item
                        label="菜单图标"
                        name="icon"
                    >
                        <Input size="large" placeholder="请点击输入框选择图标"/>
                    </Form.Item>
                    <Form.Item
                        label="查看权限"
                        name="astrict"
                    >
                        <Checkbox.Group options={userInfo.userJit} />
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                            offset: 4,
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            应用
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        )
    }

    // 渲染完成
    componentDidMount() {
        let { menuForm } = this.props;
        this.setState({
            menuForm ,
            type : menuForm.type
        })
    }

    // 组件卸载
    componentWillUnmount() {}
}

export default withRouter(CenterForm)
