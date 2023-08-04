import { useState , useEffect , useRef } from 'react';

import {Button, Input, message, Modal, Form, Switch, Table} from "antd";
import {DeleteOutlined, ExclamationCircleOutlined, PlusOutlined} from "@ant-design/icons";

import styles from './index.module.css'

import { getTopClass as getTopClassApi , deleteClass as deleteClassApi , addClass as addClassApi , updateClass as updateClassApi } from '@/api/class'

const { confirm } = Modal;

export default () => {
    const [ form , setForm ] = useState({
        edit:"",
        title:"",
        type:false
    })
    const [ activeClassList , setActiveClassList ] = useState([])
    const [ classList , setClassList ] = useState([])
    const [ addClassForm , setAddClassForm ] = useState(false)
    const [ columns ] = useState([
        {
            title: '名称',
            dataIndex: 'title',
            ellipsis : true,
            align:'center',
        },{
            title: '类型',
            dataIndex: 'type',
            align:'center',
            render: text =>{
                return (   <span> {text?"资源":"文章"} </span> )
            },
        },{
            title: '操作',
            dataIndex: 'state',
            width:180,
            render: (_,row) =>{
                return (
                    <div>
                        <Button type="link" onClick={ _=>editClass(row) }> 编辑 </Button>
                        <Button type="link" danger onClick={ _=>deleteClass(row.id) }> 删除 </Button>
                    </div>)
            },
            align:'center',
        }
    ])

    // 创建form
    const formRef = useRef(null);

    // 选中的方法
    let onSelectChange = (newSelectedRowKeys) => {
        setActiveClassList(newSelectedRowKeys)
    };

    // 获取分类数据
    let getTopClass = ()=>{
        getTopClassApi().then(res=>{
            setClassList(res.data)
        })
    }

    // 添加类别
    let addClass = ()=>{
        setForm({
            edit:"添加",
            title:"",
            type:false
        })
        setAddClassForm(true)
    }

    // 编辑类别
    let editClass = (row)=>{
        setForm({
            edit:"编辑",
            ...row,
        })
        setAddClassForm(true)
    }

    // 提交
    let submit = (values)=>{
        if( form.edit === "添加"){
            submitAddClass(values)
        }else {
            submitUpdateClass(values)
        }
    }

    // 添加
    let submitAddClass = (values)=>{
        addClassApi( values ).then(res=>{
            if(res.code === 200){
                setAddClassForm(false)
                message.success(res.msg);
            }else {
                message.error(res.msg);
            }
        })
    }

    // 修改
    let submitUpdateClass = (values)=>{
        updateClassApi( { ...form , ...values } ).then(res=>{
            if(res.code === 200){
                setAddClassForm(false)
                message.success(res.msg);
            }else {
                message.error(res.msg);
            }
        })
    }

    // 删除类别
    let deleteClass = (id) =>{
        confirm({
            title: `确定删除${ id?"此" : "这些" }类别吗?`,
            icon: <ExclamationCircleOutlined />,
            content: '此操作不可逆，请谨慎操作！',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                deleteClassApi({ id:id? id : activeClassList }).then(res=>{
                    message.success(res.msg);
                    getTopClass()
                })
            },
        });
    }

    // 关闭对话框
    let closeModal = ()=>{
        setAddClassForm(false)
    }

    let rowSelection = {
        activeClassList,
        onChange: onSelectChange,
    }
    useEffect(()=>{
        getTopClass()
    },[])

    useEffect(()=>{
        if( addClassForm ){
            formRef.current.setFieldsValue(form)
        }
    }, [ addClassForm ])

    return (
        <div className={ styles.classSet }>
            <header>
                <Button type="primary" icon={<PlusOutlined />} onClick={ addClass }> 添加 </Button>
                <Button danger disabled={ 0 >= activeClassList.length  }  icon={<DeleteOutlined />} onClick={ _=>deleteClass() } > 批量删除 </Button>
            </header>

            <Table bordered rowKey={ row => row.id }  rowSelection={rowSelection} columns={ columns } dataSource={ classList }/>

            <Modal title={ form.edit } open={ addClassForm } onOk={ _=>formRef.current.submit()} onCancel={ closeModal }>
                <Form
                    name="basic"
                    autoComplete="off"
                    initialValues={ form }
                    ref={ formRef }
                    onFinish={ submit }
                >
                    <Form.Item
                        label="类别名称"
                        name="title"
                        rules={[
                            {
                                required: true,
                                message: '此项必填！',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item label="类别属性" valuePropName="checked" name="type">
                        <Switch checkedChildren="资源" unCheckedChildren="文章" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
