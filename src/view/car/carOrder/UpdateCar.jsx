import { useState , useRef , useContext , useEffect } from 'react';
import { Form, Input, message , InputNumber , Upload , DatePicker , Select  } from 'antd';
import { LoadingOutlined ,  PlusOutlined } from '@ant-design/icons';
import moment from 'moment';

import {  addCarOrder as addCarOrderApi, getCarOrderInfo as getCarInfoApi ,
    updateCarOrder as updateCarOrderApi , getCarInfoPn as getCarInfoPnApi } from '@/api/car'
import { uploadFileDispose , beforeUpload4MB , normFile ,  } from '@/assets/js/public';
import vf from '@/assets/js/verification';

import MyContext from "@/component/MyContext/MyContext";
import PageHeader from '@/component/PageHeader/PageHeader';

const { RangePicker } = DatePicker;
const { Option } = Select;
export default ()=>{
    const { phone , require , requiredNumber , requiredArr , idNumber } = vf;

    const formRef = useRef(null);
    const [ loading , setLoading ] = useState(false);
    const [ isSubmit , setIsSubmit ] = useState(false);
    const { editForm , closeEdit } = useContext(MyContext);
    const [ carInfo , setCarInfo ] = useState({});
    const [ carPnList , setCarPnList ] = useState([]);
    const [ fileList , setFileList ] = useState([]);
    // 提交按钮
    let submit = (values)=>{
        let obj = carPnList.filter(item=>item.plate_number === values.plate_number)[0];
        let data = {
            ...values,
            id : editForm.id ,
            start_time: moment( values.time[0] ).format('YYYY-MM-DD hh:mm') ,
            end_time :  moment( values.time[1] ).format('YYYY-MM-DD hh:mm') ,
            imgs: uploadFileDispose(fileList),
            motorcycle : obj.motorcycle
        }
        delete data.time
        setCarInfo( data )
        setIsSubmit(true)
    }

    // 获取所有车牌号，车辆型号
    let getCarInfoPn = ()=>{
        getCarInfoPnApi().then(res=>{
            setCarPnList(res.data)
        })
    }

    // 获取资源内容
    let getCarInfo = () =>{

        let { id } = editForm;
        getCarInfoApi({ id }).then(res=>{
            setCarInfo( res.data );
            setFileList(JSON.parse(res.data.imgs))
            formRef.current.setFieldsValue({
                ...res.data,
                time: [ moment( res.data.start_time ) , moment( res.data.end_time ) ]
            })
        })
    }

    // 添加租车订单
    let addCarOrder = ()=>{
        addCarOrderApi(carInfo).then(res=>{
            message.success(res.msg);
            closeEdit()
        })
    }

    // 修改订单信息
    let updateCarOrder = ()=>{
        updateCarOrderApi(carInfo).then(res=>{
            message.success(res.msg);
            closeEdit()
        })
    }

    // 文件状态改变的钩子
    const handleChange = ({ fileList: newFileList }) => {
        setLoading(false);
        setFileList(newFileList)
    };

    useEffect(()=>{
        if( editForm.id ) getCarInfo();
        getCarInfoPn()
    },[])

    useEffect(()=>{
        if( isSubmit ){
            if( editForm.id ){
                updateCarOrder();
            }else {
                addCarOrder();
            }
            setIsSubmit(false)
        }
    },[ isSubmit ])

    return (
        <div>
            <PageHeader closeEdit={closeEdit} formRef={formRef} title={editForm.id? "修改租车订单":"新增租车订单" }/>

            <Form
                name="UpdateCarInfo"
                labelCol={{span: 2,}}
                wrapperCol={{span: 22,}}
                autoComplete="off"
                initialValues={ carInfo }
                ref={ formRef }
                style={{ padding:'0 10vw' }}
                onFinish={ submit }
            >
                <Form.Item label="姓名" rules={ require } name="name">
                    <Input style={{ width: 300 }}/>
                </Form.Item>
                <Form.Item label="电话" rules={ phone } name="phone">
                    <Input style={{ width: 300 }}/>
                </Form.Item>
                <Form.Item label="身份证号" rules={ idNumber } name="idNumber">
                    <Input style={{ width: 300 }}/>
                </Form.Item>
                <Form.Item label="车牌号" rules={ require } name="plate_number">
                    <Select style={{width: 300}}>
                        {
                            carPnList && carPnList.map(item=>
                                <Option key={ item.id } value={ item.plate_number }> { item.plate_number } </Option>
                            )
                        }
                    </Select>
                </Form.Item>
                <Form.Item label="行驶里程" name="mileage">
                    <InputNumber
                        addonAfter="km"
                        min={ 0 }
                        style={{
                            width: 300,
                        }}
                    />
                </Form.Item>
                <Form.Item label="租车时间" rules={ requiredArr } name="time">
                    <RangePicker format="YYYY-MM-DD HH:mm" showTime />
                </Form.Item>
                <Form.Item label="租金" rules={ requiredNumber } name="guarantee_deposit">
                    <InputNumber
                        addonBefore="￥"
                        min={ 0 }
                        style={{
                            width: 300,
                        }}
                    />
                </Form.Item>
                <Form.Item label="押金" rules={ requiredNumber } name="money">
                    <InputNumber
                        addonBefore="￥"
                        min={ 0 }
                        style={{
                            width: 300,
                        }}
                    />
                </Form.Item>

                <Form.Item label="备注" name="other">
                    <Input.TextArea style={{
                        width: 400,
                    }} allowClear showCount />
                </Form.Item>

                <Form.Item label="车辆图片" name="imgs" getValueFromEvent={ normFile } valuePropName="imgs">
                    <Upload
                        listType="picture-card"
                        className="avatar-uploader"
                        fileList={ fileList }
                        accept="image/jpg,image/jpeg,image/png"
                        action="/unApi/uploadFile"
                        beforeUpload={ beforeUpload4MB }
                        onChange={ handleChange }
                    >
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
                    </Upload>
                </Form.Item>
            </Form>
        </div>
    )
}
