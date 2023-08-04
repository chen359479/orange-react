import { useState } from 'react';

import { Row , Col , Steps , Card   } from 'antd';
import LeftCard from "./LeftCard";
import CenterForm from "./CenterForm";
import MyContext from "@/component/MyContext/MyContext";

export default ()=> {
    const [ menuForm , setMenuForm ] = useState({})
    const [ updateStatus , setUpdateStatus ] = useState(false)

    // 更新menu
    let editMenu = menuForm =>{
        setMenuForm(menuForm)
    }

    const items = [
            { title: '添加菜单',
                description: (
                    <div>
                        <p>菜单路径、组件名称、菜单名称请勿与现有菜单重复。</p>
                        <p>菜单路径为地址栏显示路径。</p>
                    </div>
                )
            },
            { title: '归纳菜单',description:"将新建菜单添加到其上级菜单的子集中。（顶级菜单无须）" },
            { title: '重新获取', description:"退出，重新登录。" }
        ];

    return (
        <Row gutter={16}>
            <Col span={4}>
                <MyContext.Provider value={{
                    editMenu ,
                    updateStatus
                }}>
                    <LeftCard/>
                </MyContext.Provider>

            </Col>
            <Col span={14}>
                <MyContext.Provider value={{
                    menuForms : menuForm ,
                    setUpdateStatus : ()=> setUpdateStatus(!updateStatus)
                }}>
                    <CenterForm />
                </MyContext.Provider>

            </Col>
            <Col span={6}>
                <Card>
                    <Steps direction="vertical"  current={3} style={{height: '60vh'}} items={ items }>
                    </Steps>
                </Card>
            </Col>
        </Row>
    )
}
