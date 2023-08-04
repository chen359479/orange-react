import { useState , useEffect } from 'react';

import {Button,  Modal , Upload , message } from "antd";
import { InboxOutlined , DeleteOutlined  } from "@ant-design/icons";

import { getDocumentList as getDocumentListApi , deleteDocument as deleteDocumentApi } from "@/api/document";
import { search , confirmMsg } from '@/assets/js/public'
import store from "@/store";

import SearchBox from "@/component/SearchBox/Index";
import TableBox from "@/component/TableBox/Index";

const { Dragger } = Upload;
const { confirm } = Modal;

export default () => {
    const [ searchForm , setSearchForm ] = useState({
        ...search,
        type:''
    })

    const [ columns ] = useState([
        {
            title: '文件名',
            dataIndex: 'name',
            align:'center',
        },{
            title: '文件类型',
            dataIndex: 'type',
            align:'center',
        },{
            title: '文件上传时间',
            dataIndex: 'created_time',
            align:'center',
        },{
            title: '操作',
            dataIndex: 'state',
            render: (_,row) =>{
                return (
                    <div>
                        <Button type="link" onClick={ _=>downloadDoc(row.url) } block> 下载 </Button>
                    </div>
                )
            },
            align:'center',
        }
    ]);

    const [ docList , setDocList ] = useState([]);
    const [ activeList , setActiveList ] = useState([]);
    const [ isModalOpen , setIsModalOpen ] = useState(false);
    const [ multiple , setMultiple ] = useState(false);
    const [ total , setTotal ] = useState(false);
    const { token } = store.getState().user;

    // 获取文件列表
    let getDocumentList = ()=>{
        getDocumentListApi( searchForm ).then(res=>{
            setDocList(res.data)
            setTotal(res.total)
        })
    }

    // 关闭对话框
    let closeModal = ()=>{
        setIsModalOpen(false)
    }

    // 打开文件上传对话框
    let openUpload = ( multiple )=>{
        setIsModalOpen(true);
        setMultiple(multiple)
    }

    // 下载文件
    let downloadDoc = ( url )=>{
        let elemIF = document.createElement("iframe");
        elemIF.src = url;
        elemIF.style.display = "none";
        document.body.appendChild(elemIF);
    }

    // 文件上传之前
    let beforeUpload = ( file )=>{
        let i = file.name.lastIndexOf("."); // 找到后缀名点的位置
        let suffix = file.name.substring(i, file.name.length); // 截取文件的后缀名
        let arr = [ ".img" ,'.jpg' ,'.png' ,'.img' ,'.docx' ,'.doc' ,'.ppt' ,'.excel' ,'.pptx' ,'.txt' ,'.xls' ,'.xlsx' ]
        const type = arr.includes(suffix);
        if (!type) {
            message.error("上传的文件类型只能是"+arr.join("|")+"中的类型");
        }
        return type;
    }

    // 删除文件
    let deleteFile = ()=>{
        confirm({
            title: `确定删除这些内容吗?`,
            ...confirmMsg,
            onOk() {
                deleteDocumentApi({ id:activeList }).then(res=>{
                    message.success(res.msg);
                    getDocumentList()
                })
            },
        });
    }

    const props = {
        name: 'file',
        multiple,
        headers:{ authorization : token },
        beforeUpload,
        accept:".img,.jpg,.png,.img,.docx,.doc,.ppt,.excel,.pptx,.txt,.xls,.xlsx",
        action: '/api/addDocument',
        onChange(info) {
            const { status , response } = info.file;
            if (status === 'error') {
                message.error(`${info.file.name} 文件上传失败。`);
            }else if (status === 'done' && response.code === 400 ) {
                message.error(`${info.file.name} 文件上传失败。`);
            }else if(status === 'done' && response.code === 200 )  {
                message.success(`${info.file.name} 文件上传成功。`);
                getDocumentList()
            }
        }
    };

    const startArr = [
        {
            name :'type',
            label:'文件类型',
            type:'input'
        },{
            name :'name',
            label:'文件名称',
            type:'input'
        }
    ]

    const endArr = [
        <Button danger disabled={ 0 >= activeList.length  }  icon={<DeleteOutlined />} onClick={ deleteFile } > 批量删除 </Button>,
        <Button type="primary" onClick={ _=>openUpload(false) }> 单文件上传 </Button>,
        <Button type="primary" onClick={ _=>openUpload(true) }> 多文件上传 </Button>
    ]

    useEffect(()=>{
        getDocumentList()
    },[ searchForm ])

    return (
        <div>
            <SearchBox startArr={ startArr } endArr={endArr} searchForm={ searchForm } setSearchForm={ setSearchForm }/>

            <TableBox columns={ columns } activeList={ activeList } setActiveList={ setActiveList }
                      dataSource={ docList } searchForm={searchForm} total={total} setSearchForm={setSearchForm}/>

            <Modal title={ multiple?"多文件上传":"单文件上传" } open={ isModalOpen } onOk={ closeModal } onCancel={ closeModal }>
                <Dragger { ...props }>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">将文件拖到此处，或<em>点击上传</em></p>
                    <p className="ant-upload-hint">
                        Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                        banned files.
                    </p>
                </Dragger>
            </Modal>
        </div>
    )
}
