import {  useRef , useEffect } from 'react';
import {Button, Input,  Form , Select ,  } from "antd";
import { search } from "../../assets/js/public";
import { SearchOutlined } from '@ant-design/icons';

import styles from './index.module.css';

const { Option } = Select;
export default ( props )=>{
    let {  setSearchForm , startArr , endArr = [] , searchForm } = props;
    const formRef = useRef(null);

    // 重置方法
    let onReset = () => {
        setSearchForm(search);
        formRef.current.resetFields();
    };

    // 提交的方法
    let onFinish = (e)=>{
        setSearchForm({
            ...searchForm,
            page:1,
            ...e
        })
    }

    useEffect(() => {
        formRef.current.resetFields();
    }, [ searchForm ]);

    return (
        <header className={ styles.header }>
            <Form
                key={ searchForm }
                labelCol={{ span: 0, }}
                wrapperCol={{ span: 24, }}
                initialValues={ searchForm }
                autoComplete="off"
                layout="inline"
                ref={ formRef }
                onFinish={ onFinish }
            >
                {
                    startArr.map(item=>{
                        return (
                            <Form.Item key={item.name} name={ item.name }>
                                {
                                    item.type === 'input'?
                                        <Input style={{width: 200}} placeholder={ "请输入"+item.label } />:
                                        <Select style={{width: 200}} placeholder={ "请输入"+item.label } >
                                            {
                                                item.selectData && item.selectData.map(item=>
                                                    <Option key={item.id || item.value} value={ item.id || item.value }> { item.title || item.label } </Option>
                                                )
                                            }
                                        </Select>
                                }
                            </Form.Item>
                        )
                    })
                }

                <Form.Item>
                    <Button type="primary" icon={<SearchOutlined />} htmlType="submit">搜索</Button>
                </Form.Item>

                <Form.Item>
                    <Button htmlType="button" onClick={ onReset }>重置</Button>
                </Form.Item>

                {
                    endArr && endArr.map((item,index)=>{
                        return (
                            <Form.Item key={index}>
                                { item }
                            </Form.Item>
                        )
                    })
                }
            </Form>
        </header>
    )
}
