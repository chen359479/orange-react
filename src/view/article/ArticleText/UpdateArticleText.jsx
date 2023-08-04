import { useState , useRef , useContext , useEffect } from 'react';
import { Form, Input, message , InputNumber , Switch , Upload , Select  } from 'antd';

import { LoadingOutlined ,  PlusOutlined } from '@ant-design/icons';

import {
    getArticleTextInfo as getArticleTextInfoApi ,
    updateArticleTextInfo as updateArticleTextInfoApi ,
    addArticleTextInfo as addArticleTextInfoApi
} from "@/api/article";
import { getTopClass  as getTopClassApi } from '@/api/class';

import { beforeUpload4MB , normFile  } from '@/assets/js/public';
import vf from '@/assets/js/verification';

import store from "@/store";
import ReEditor from '@/component/ReEditor/ReEditor';
import MyContext from "@/component/MyContext/MyContext";
import PageHeader from '@/component/PageHeader/PageHeader';

const { Option } = Select;

export default ()=>{
    const [ articleInfo , setArticleInfo ] = useState({
        title:"",
        price:1,
        discount:1,
        status:true,
        imageUrl:"",
        content:""
    })
    const { require , requiredNumber } = vf;
    const { token } = store.getState().user;
    const [ loading , setLoading ] = useState(false);
    const [ isSubmit , setIsSubmit ] = useState(false);
    const [ topClass , setTopClass ] = useState([]);
    // 接收父组件抛出的EditContext
    const { editForm , closeEdit } = useContext(MyContext)

    // 创建form
    let formRef = useRef(null);

    // 提交按钮
    let submit = (values)=>{
        setArticleInfo({
            ...values,
            classID : editForm.classID,
            content : articleInfo.content,
            id : editForm.id
        })
        setIsSubmit(true)
    }

    // 获取顶级分类
    let getTopClass = ()=>{
        getTopClassApi({ type : 0 }).then(res=>{
            setTopClass(res.data);
        })
    }

    // 更新信息
    let updateArticleTextInfo = ()=>{
        updateArticleTextInfoApi( articleInfo ).then(res=>{
            message.success(res.msg);
            closeEdit()
        })
    }

    // 获取文章内容
    let getArticleTextInfo = ()=>{
        let { id } = editForm;
        getArticleTextInfoApi({ id }).then(res=>{
            setArticleInfo( res.data )
            formRef.current.setFieldsValue({
                ...res.data
            })
        })
    }

    // 新增文章
    let addArticleTextInfo = ()=>{
        addArticleTextInfoApi( articleInfo ).then(res=>{
            message.success(res.msg);
            closeEdit()
        })
    }

    // 文件状态改变的钩子
    let handleChange = (info) => {
        if (info.file.status === 'uploading') {
            setLoading(true)
            return;
        }
        if (info.file.status === 'done') {
            setLoading(false);
            setArticleInfo({
                ...articleInfo,
                imageUrl : info.file.response.src
            })
            formRef.current.setFieldsValue({
                imageUrl: info.file.response.src
            });
        }
    };

    useEffect(()=>{
        getTopClass();
        if( editForm.id ) getArticleTextInfo()
    },[])

    useEffect(()=>{
        if( isSubmit ){
            if( editForm.id ){
                updateArticleTextInfo();
            }else {
                addArticleTextInfo();
            }
            setIsSubmit(false)
        }
    },[ isSubmit ])

    return (
        <div>
            <PageHeader closeEdit={closeEdit} title={ editForm.id? "修改":"新增" } formRef={formRef} />

            <Form
                name="UpdateArticleText"
                labelCol={{span: 2,}}
                wrapperCol={{span: 22,}}
                autoComplete="off"
                initialValues={ articleInfo }
                ref={ formRef }
                style={{ padding:'0 10vw' }}
                onFinish={ submit }
            >
                <Form.Item label="类别" rules={ requiredNumber } name="classID">
                    <Select>
                        {
                            topClass && topClass.map(item=>
                                <Option key={ item.id } value={ item.id }> { item.title } </Option>
                            )
                        }
                    </Select>
                </Form.Item>
                <Form.Item label="标题" rules={ require } name="title">
                    <Input />
                </Form.Item>
                <Form.Item required label="价格" name="price">
                    <InputNumber
                        prefix="￥"
                        min={ 0 }
                        step={ 0.01 }
                        style={{
                            width: 200,
                        }}
                    />
                </Form.Item>
                <Form.Item required label="折扣" name="discount" tooltip={"1为不打折，0.5为打五折"}>
                    <InputNumber
                        prefix="￥"
                        min={ 0 }
                        max={ 1 }
                        step={ 0.01 }
                        style={{
                            width: 200,
                        }}
                    />
                </Form.Item>
                <Form.Item required label="状态"  valuePropName="checked" name="status">
                    <Switch checkedChildren="上架" unCheckedChildren="下架" />
                </Form.Item>
                <Form.Item label="文章封面" rules={ require } name="imageUrl" getValueFromEvent={ normFile } valuePropName="imageUrl">
                    <Upload
                        listType="picture-card"
                        className="avatar-uploader"
                        accept="image/jpg,image/jpeg,image/png"
                        showUploadList={false}
                        action="/unApi/uploadFile"
                        beforeUpload={ beforeUpload4MB }
                        headers={{ authorization : token }}
                        onChange={ handleChange }
                    >
                        { articleInfo.imageUrl.length ? (
                            <img
                                src={ articleInfo.imageUrl }
                                alt="文章封面"
                                style={{
                                    width: '100%',
                                    height:"100%"
                                }}
                            />
                        ) : (
                            <div>
                                {loading? <LoadingOutlined /> : <PlusOutlined />}
                                <div
                                    style={{
                                        marginTop: 8,
                                    }}
                                >
                                    Upload
                                </div>
                            </div>
                        )}
                    </Upload>
                </Form.Item>

                <Form.Item label="内容信息" required>
                    <MyContext.Provider value={{ initialValue : articleInfo.content, reEditorChange : e=>{ setArticleInfo( {  ...articleInfo , content:e }) }  }}>
                        <ReEditor />
                    </MyContext.Provider>
                </Form.Item>
            </Form>

        </div>
    )
}
