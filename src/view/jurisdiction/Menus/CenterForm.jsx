import { useState , useEffect , useContext , useRef } from 'react';
import {Card, Button, Checkbox, Form, Input, InputNumber, Switch, Select, message} from 'antd';
import Icon from '@ant-design/icons'
import * as icons from '@ant-design/icons'

import {getCanAddSubset as getCanAddSubsetApi, updateMenus, writeMenus} from '@/api/menus';
import store from "@/store";
import vf from "@/assets/js/verification";

import MyContext from "@/component/MyContext/MyContext";

import styles from './index.module.css';
const {Option} = Select;

export default () => {

    const [ canSubset , setCanSubset ] = useState([]);
    const { menuForms , setUpdateStatus } = useContext(MyContext);
    const [ type , setType ] = useState(true);
    const iconList = Object.keys(icons).filter((item) => typeof icons[item] === 'object');

    // 创建form
    const formRef = useRef(null);
    const { userJit } = store.getState().user;

    // 表单验证成功后的回调
    let onFinish = e => {
        e.hierarchy = menuForms.hierarchy;
        if (menuForms.id) {
            e.id = menuForms.id;
            updateMenus(e).then(res => {
                message.success(res.msg);
            })
        } else {
            writeMenus(e).then(res => {
                message.success(res.msg);
            })
        }
        setUpdateStatus()
        formRef.current.resetFields();
    }

    // 获取可添加的菜单
    let getCanAddSubset = () => {
        let d = {
            hierarchy: menuForms.hierarchy,
            children: JSON.stringify(JSON.stringify(menuForms.children))
        };

        if (d.hierarchy === 3) {
            setCanSubset([])
        } else {
            getCanAddSubsetApi(d).then(res => {
                setCanSubset(res.data)
            });
        }
    }

    useEffect(()=>{
        if( menuForms.hierarchy ){
            getCanAddSubset()
        }
        setType(menuForms.type)
    },[ menuForms ])

    return (
        <Card>
            <Form
                name="basic"
                labelCol={{span: 4,}}
                wrapperCol={{span: 20,}}
                initialValues={ menuForms }
                onFinish={ onFinish }
                autoComplete="off"
                key={ menuForms.msg }
                ref={ formRef }
            >
                <h2 className={styles.h2}> { menuForms.msg } </h2>
                <Form.Item
                    label="菜单路径"
                    name="viewPath"
                    rules={vf.viewPath}
                >
                    <Input size="large" placeholder="页面路径"/>
                </Form.Item>
                <Form.Item
                    label="组件名称"
                    name="name"
                    rules={vf.name}
                >
                    <Input size="large" placeholder="组件名称"/>
                </Form.Item>
                <Form.Item
                    label="菜单名称"
                    name="title"
                    rules={vf.viewTitle}
                >
                    <Input size="large" placeholder="菜单名称"/>
                </Form.Item>
                <Form.Item
                    label="排序"
                    name="sequence"
                    rules={ vf.requiredNumber }
                >
                    <InputNumber min={ 0 } max={ 99 }  size="large" controls={ false } style={{width: "100%"}}
                                 placeholder="请输入数字，数字越小排序越靠前"/>
                </Form.Item>
                <Form.Item
                    label="菜单类型"
                    name="type"
                    valuePropName="checked"
                >
                    <Switch size="large"
                            disabled={ menuForms.hierarchy === 3 }
                            onChange={ e => setType(e) }
                            checkedChildren="页面"
                            unCheckedChildren="菜单"
                            defaultChecked={ type }
                    />
                </Form.Item>
                {
                    !type ? (
                        <Form.Item
                            label="子集"
                            name="children"
                        >
                            <Select
                                mode="multiple"
                                placeholder="请选择子集"
                                size="large"
                            >
                                {
                                    canSubset.map(item => {
                                        return (
                                            <Option key={item.id} value={item.id}>{item.title}</Option>
                                        )
                                    })
                                }
                            </Select>
                        </Form.Item>
                    ) : null
                }
                <Form.Item label="菜单图标" name="icon">
                    <Select
                        showSearch
                        allowClear
                    >
                        {
                            iconList.map(item => {
                                return <Option value={item} key={item}>
                                    <Icon component={icons[item]} style={{marginRight: '8px'}} />
                                    {item}
                                </Option>
                            })
                        }
                    </Select>
                </Form.Item>
                <Form.Item label="查看权限" name="astrict">
                    <Checkbox.Group options={ userJit }/>
                </Form.Item>

                <Form.Item
                    wrapperCol={{offset: 4,}}
                >
                    <Button type="primary" htmlType="submit">
                        应用
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    )
}
