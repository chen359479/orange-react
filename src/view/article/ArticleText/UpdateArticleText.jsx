import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {Button, Form, Input, PageHeader , message } from 'antd';

import { updateArticleTextInfo} from "../../../api/article";
import ReEditor from '../../../component/ReEditor/ReEditor'

class UpdateArticleText extends Component {
    constructor(props) {

        super(props);
        this.state = {
            articleInfo:{},
            content:props.content
        };
    }

    // 创建form
    formRef = React.createRef();

    // 更新信息
    updateArticleTextInfo = e=>{
        e.id = this.props.id;
        e.tableName = this.props.tableName;

        updateArticleTextInfo(e).then(res=>{
            message.success(res.msg);
        })
    }

    render() {
        let { title , closeEdit } = this.props,
            { content } = this.state;
        return (
            <div>
                <PageHeader
                    ghost={false}
                    onBack={ closeEdit }
                    title={title}
                    extra={[
                        <Button key="3" type="primary" onClick={ _=>this.formRef.current.submit() }> 修改 </Button>,
                        <Button key="1" type="primary" danger onClick={ closeEdit }> 取消 </Button>,
                    ]}
                >
                </PageHeader>
                <Form
                    name="UpdateArticleText"
                    labelCol={{span: 2,}}
                    wrapperCol={{span: 22,}}
                    autoComplete="off"
                    initialValues={{ title }}
                    ref={this.formRef}
                    style={{ padding:'0 10vw' }}
                    onFinish={ this.updateArticleTextInfo }
                >
                    <Form.Item label="标题" name="title">
                        <Input />
                    </Form.Item>

                    <Form.Item label="内容信息">
                        <ReEditor value={ content } reEditorChange={ e=>{this.setState({ content:e }) } }/>
                    </Form.Item>
                </Form>

            </div>
        )
    }
}

export default withRouter(UpdateArticleText)
