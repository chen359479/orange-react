import { useState , useRef , useContext , useEffect } from 'react';
import {Button, Form, Input, message , Row , Upload , DatePicker , Col , InputNumber , Switch  } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment';

import {  addCarInfo as addCarInfoApi, getCarInfo as getCarInfoApi , updateCarInfo as updateCarInfoApi } from '@/api/car';
import { uploadFileDispose , beforeUpload4MB , normFile , } from '@/assets/js/public';
import vf from '@/assets/js/verification';

import MyContext from "@/component/MyContext/MyContext";
import PageHeader from '@/component/PageHeader/PageHeader'

export default ()=>{

    const { require , requiredNumber , requiredObj , engineNumber , vinReg } = vf;
    const formRef = useRef(null);
    const [ isSubmit , setIsSubmit ] = useState(false);
    const { editForm , closeEdit } = useContext(MyContext);
    const [ carInfo , setCarInfo ] = useState({})
    // 交强险附件
    const [ fileList , setFileList ] = useState([]);
    // 商业险附件
    const [ CIFileList , setCIFileList ] = useState([]);
    // 行驶证照片
    const [ DIFileList , setDIFileList ] = useState([]);
    // 车辆照片
    const [ CarFileList , setCarFileList ] = useState([]);

    // 提交按钮
    let submit = (values)=>{
        let data = {
            ...values,
            id : editForm.id ,
            start_time: moment( values.start_time ).format('YYYY-MM-DD') ,
            mandatory : moment( values.mandatory ).format('YYYY-MM-DD') ,
            commercial_insurance: moment( values.commercial_insurance ).format('YYYY-MM-DD') ,
            m_c_doc: uploadFileDispose(fileList),
            c_i_doc: uploadFileDispose(CIFileList),
            driving_image: uploadFileDispose(DIFileList),
            car_image: uploadFileDispose(CarFileList),
        }
        setCarInfo( data )
        setIsSubmit(true)
    }

    // 获取资源内容
    let getCarInfo = () =>{
        let { id } = editForm;
        getCarInfoApi({ id }).then(res=>{

            setCarInfo( res.data );
            setFileList(JSON.parse(res.data.m_c_doc));
            setCIFileList(JSON.parse(res.data.c_i_doc));
            setDIFileList(JSON.parse(res.data.driving_image));
            setCarFileList(JSON.parse(res.data.car_image));

            formRef.current.setFieldsValue({
                ...res.data,
                mandatory: moment( res.data.mandatory ),
                commercial_insurance: moment( res.data.commercial_insurance ),
                start_time: moment( res.data.start_time ),
            })
        })
    }

    // 添加租车订单
    let addCarInfo = ()=>{
        addCarInfoApi(carInfo).then(res=>{
            message.success(res.msg);
            closeEdit()
        })
    }

    // 修改订单信息
    let updateCarInfo = ()=>{
        updateCarInfoApi(carInfo).then(res=>{
            message.success(res.msg);
            closeEdit()
        })
    }

    useEffect(()=>{
        if( editForm.id ) getCarInfo()
    },[])

    useEffect(()=>{
        if( isSubmit ){
            if( editForm.id ){
                updateCarInfo();
            }else {
                addCarInfo();
            }
            setIsSubmit(false)
        }
    },[ isSubmit ])

    return (
        <div>
            <PageHeader closeEdit={closeEdit} formRef={formRef} title={editForm.id? "修改车辆信息":"新增车辆" }/>

            <Form
                name="UpdateCarInfo"
                labelCol={{span: 8,}}
                wrapperCol={{span: 16,}}
                autoComplete="off"
                initialValues={ carInfo }
                ref={ formRef }
                style={{ padding:'0 1vw' }}
                onFinish={ submit }
            >
                <Row>
                    <Col span={12} >
                        <Form.Item label="车辆型号" rules={ require } name="motorcycle">
                            <Input style={{ width: 300 }}/>
                        </Form.Item>
                    </Col>

                    <Col span={12} >
                        <Form.Item label="车牌号" rules={ require } name="plate_number">
                            <Input style={{width: 300}}/>
                        </Form.Item>
                    </Col>

                    <Col span={12} >
                        <Form.Item label="车身颜色" rules={ require } name="color">
                            <Input style={{ width: 300 }}/>
                        </Form.Item>
                    </Col>

                    <Col span={12} >
                        <Form.Item label="车辆状态" name="status" required valuePropName="checked">
                            <Switch checkedChildren="上架" unCheckedChildren="下架"  />
                        </Form.Item>
                    </Col>

                    <Col span={12} >
                        <Form.Item label="购车金额" rules={ requiredNumber } name="money">
                            <InputNumber style={{ width: 300 }}/>
                        </Form.Item>
                    </Col>

                    <Col span={12} >
                        <Form.Item label="额外花费" rules={ requiredNumber } name="expenditure">
                            <InputNumber style={{ width: 300 }}/>
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item label="发动机号" rules={ engineNumber } name="engine_number">
                            <Input style={{ width: 300 }}/>
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item label="车架号" rules={ vinReg } name="vin">
                            <Input style={{ width: 300 }}/>
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item label="上牌时间" rules={ requiredObj } name="start_time">
                            <DatePicker format="YYYY-MM-DD" style={{ width: 300 }}/>
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item label="交强险公司" rules={ require } name="mandatory_company">
                            <Input style={{ width: 300 }}/>
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item label="交强险到期时间" rules={ requiredObj } name="mandatory">
                            <DatePicker format="YYYY-MM-DD" style={{ width: 300 }}/>
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item label="交强险附件" name="m_c_doc" getValueFromEvent={ normFile } valuePropName="m_c_doc">
                            <Upload
                                fileList={ fileList }
                                action="/unApi/uploadFile"
                                onChange={ ({ fileList: newFileList }) => setFileList(newFileList) }
                            >
                                <Button icon={<UploadOutlined />}>点击上传</Button>
                            </Upload>
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item label="商业险到期时间" rules={ requiredObj } name="commercial_insurance">
                            <DatePicker format="YYYY-MM-DD" style={{ width: 300 }}/>
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item label="商业险附件" name="c_i_doc" getValueFromEvent={ normFile } valuePropName="c_i_doc">
                            <Upload
                                fileList={ CIFileList }
                                action="/unApi/uploadFile"
                                onChange={ ({ fileList: newFileList }) => setCIFileList(newFileList) }
                            >
                                <Button icon={<UploadOutlined />}>点击上传</Button>
                            </Upload>
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item label="行驶证照片" name="driving_image" getValueFromEvent={ normFile } valuePropName="driving_image">
                            <Upload
                                fileList={ DIFileList }
                                accept="image/jpg,image/jpeg,image/png"
                                maxCount={ 2 }
                                beforeUpload={ beforeUpload4MB }
                                action="/unApi/uploadFile"
                                onChange={ ({ fileList: newFileList }) => setDIFileList(newFileList) }
                            >
                                <Button icon={<UploadOutlined />}>点击上传</Button>
                            </Upload>
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item label="车辆图片" name="car_image" getValueFromEvent={ normFile } valuePropName="car_image">
                            <Upload
                                className="avatar-uploader"
                                fileList={ CarFileList }
                                accept="image/jpg,image/jpeg,image/png"
                                action="/unApi/uploadFile"
                                beforeUpload={ beforeUpload4MB }
                                onChange={ ({ fileList: newFileList }) => setCarFileList(newFileList) }
                            >
                                <Button icon={<UploadOutlined />}>点击上传</Button>
                            </Upload>
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item label="备注" name="other">
                            <Input.TextArea style={{ width: '30vw',}} allowClear showCount />
                        </Form.Item>
                    </Col>

                </Row>
            </Form>
        </div>
    )
}
