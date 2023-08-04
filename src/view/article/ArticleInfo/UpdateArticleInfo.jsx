import { useState , useRef , useContext , useEffect } from 'react';
import { Form, Input,  message , InputNumber , Switch , Upload , Select  } from 'antd';
import { LoadingOutlined ,  PlusOutlined } from '@ant-design/icons';

import {
    getArticleInfo as getArticleInfoApi,
    updateArticleInfo as updateArticleInfoApi,
    addArticleInfo as addArticleInfoApi
} from "@/api/article";
import { getTopClass  as getTopClassApi } from '@/api/class';

import { beforeUpload4MB , videoBeforeUpload , normFile  } from '@/assets/js/public';
import vf from '@/assets/js/verification';
import store from "@/store";

import MyContext from "@/component/MyContext/MyContext";
import PageHeader from '@/component/PageHeader/PageHeader';

const { Option } = Select;

export default ()=>{
    const { require , requiredNumber } = vf;
    const [ articleInfo , setArticleInfo ] = useState({
        title: '',
        price: 1,
        discount: 1,
        status: true,
        imageUrl: '',
        videoType: false,
        url: '',
        classID: 1
    })

    const formRef = useRef(null);
    const { token } = store.getState().user;
    const { editForm , closeEdit } = useContext(MyContext);
    const [ loading , setLoading ] = useState(false);
    const [ isSubmit , setIsSubmit ] = useState(false);
    const [ videoType , setVideoType ] = useState(false);
    const [ topClass , setTopClass ] = useState([]);

    // 提交按钮
    let submit = (values)=>{
        setArticleInfo({
            ...values,
            id : editForm.id
        })
        setIsSubmit(true)
    }

    // 获取顶级分类
    let getTopClass = ()=>{
        getTopClassApi({ type : 1 }).then(res=>{
            setTopClass(res.data);
        })
    }

    // 获取资源内容
    let getArticleInfo = () =>{
        let { id } = editForm;
        getArticleInfoApi({ id }).then(res=>{
            setArticleInfo( res.data )
            formRef.current.setFieldsValue({
                ...res.data
            })
        })
    }

    //新增资源
    let addArticleInfo = ()=>{
        addArticleInfoApi( articleInfo ).then(res=>{
            message.success(res.msg);
            closeEdit()
        })
    }

    // 修改资源
    let updateArticleInfo = ()=>{
        updateArticleInfoApi( articleInfo ).then(res=>{
            message.success(res.msg);
            closeEdit()
        })
    }

    // 文件状态改变的钩子
    let handleChange = (info , type ) => {
        if (info.file.status === 'uploading') {
            setLoading(true)
            return;
        }
        if (info.file.status === 'done') {
            setLoading(false);
            setArticleInfo({
                ...articleInfo,
                [ type? 'url' : 'imageUrl' ] :  info.file.response.src
            });
            formRef.current.setFieldsValue({
                [ type? 'url' : 'imageUrl' ] :  info.file.response.src
            });
        }
    };

    // 视频上传类型的切换事件
    let videoTypeChange = ( e )=>{
        setVideoType(e);
        formRef.current.setFieldsValue({
            url : ''
        });
    }

    useEffect(()=>{
        getTopClass();
        if( editForm.id ) getArticleInfo()
    },[])

    useEffect(()=>{
        if( isSubmit ){
            if( editForm.id ){
                updateArticleInfo();
            }else {
                addArticleInfo();
            }
            setIsSubmit(false)
        }
    },[ isSubmit ])

    return (
        <div>
            <PageHeader closeEdit={closeEdit} title={ editForm.id? "修改":"新增" } formRef={formRef} />

            <Form
                name="UpdateArticleInfo"
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
                <Form.Item required label="状态" valuePropName="checked" name="status">
                    <Switch checkedChildren="上架" unCheckedChildren="下架" />
                </Form.Item>
                <Form.Item rules={ require } label="视频封面" name="imageUrl" getValueFromEvent={ normFile } valuePropName="imageUrl">
                    <Upload
                        listType="picture-card"
                        className="avatar-uploader"
                        accept="image/jpg,image/jpeg,image/png"
                        showUploadList={false}
                        action="/unApi/uploadFile"
                        beforeUpload={ beforeUpload4MB }
                        headers={{ authorization : token }}
                        onChange={ e=>handleChange(e,false) }
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
                <Form.Item required label="视频类型" valuePropName="checked" name="videoType">
                    <Switch checkedChildren="自行上传" unCheckedChildren="外部链接" onChange={ e=>videoTypeChange(e) } />
                </Form.Item>
                <Form.Item hidden={ videoType } rules={ require } label="外链地址"  name="url">
                    <Input />
                </Form.Item>
                <Form.Item hidden={ !videoType } rules={ require } label="视频上传" name="url" getValueFromEvent={ normFile } valuePropName="url">
                    <Upload
                        listType="picture-card"
                        className="avatar-uploader"
                        accept=".mp4"
                        showUploadList={false}
                        action="http://123.249.91.200:8181/unApi/uploadFile"
                        beforeUpload={ videoBeforeUpload }
                        headers={{ authorization : token }}
                        onChange={ e=>handleChange(e,true) }
                    >
                        { articleInfo.url? (
                            <img
                                src={ articleInfo.url }
                                alt="视频资源"
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
            </Form>
        </div>
    )
}
