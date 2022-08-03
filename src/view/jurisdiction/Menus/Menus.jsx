import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import { Row , Col , Steps , Card   } from 'antd';

import LeftCard from "./LeftCard";
import CenterForm from "./CenterForm";

const { Step } = Steps;
class Menus extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuForm:{  },
        };
    }

    // 更新menu
    editMenu = menuForm =>{
        this.setState({
            menuForm
        })
    }



    render() {
        let { menuForm  } = this.state;
        return (
            <Row gutter={16}>
                <Col span={4}>
                    <LeftCard editMenu = {this.editMenu} />
                </Col>
                <Col className="gutter-row" span={14}>
                    <CenterForm key={ menuForm.msg } menuForm = { menuForm } />
                </Col>
                <Col className="gutter-row" span={6}>
                    <Card>
                        <Steps direction="vertical"  current={3} style={{height: '60vh'}}>
                            <Step title="添加菜单" description={
                                <div>
                                    <p>菜单路径、组件名称、菜单名称请勿与现有菜单重复。</p>
                                    <p>菜单路径为地址栏显示路径。</p>
                                </div>
                            } />
                            <Step title="归纳菜单" description="将新建菜单添加到其上级菜单的子集中。（顶级菜单不用）" />
                            <Step title="重新获取" description="退出，重新登录。" />
                        </Steps>
                    </Card>
                </Col>
            </Row>
        )
    }

    // 渲染完成
    componentDidMount() {

    }

    // 组件卸载
    componentWillUnmount() {
    }
}

export default withRouter(Menus)
