import { Button } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';

export default (props)=>{
    let { closeEdit , title , formRef } = props;

    return (
        <PageHeader
            ghost={ false }
            onBack={ closeEdit }
            title={ title }
            extra={[
                <Button key="3" type="primary" onClick={ _=>formRef.current.submit() }> 提交 </Button>,
                <Button key="1" type="primary" danger onClick={ closeEdit }> 取消 </Button>,
            ]}
        />
    )
}
