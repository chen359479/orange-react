import { useState , useEffect , useContext } from 'react';
import { Card , Button , message , Modal  } from 'antd';

import { getMenuList as getMenuListApi , deleteMenu as deleteMenuApi  } from '@/api/menus';
import { confirmMsg } from '@/assets/js/public'

import MyContext from "@/component/MyContext/MyContext";
import styles from './index.module.css'

const { confirm } = Modal;
export default () => {

    const [ allMenuList , setAllMenuList ] = useState([]);
    const [ startMenuForm , setStartMenuForm ] = useState({
        viewPath:"",
        name:"",
        title:"",
        sequence:99,
        children:[],
        icon:"",
        astrict:['user'],
        type:true,
        msg:''
    });
    const [ titleList ] =  useState([ "顶级菜单","二级菜单","三级菜单"]);
    const { editMenu , updateStatus } = useContext(MyContext);

    // 获取分类的菜单
    let getMenuList = _=>{
        getMenuListApi().then(res=>{
            setAllMenuList(res.data)
        })
    }

    // 新增菜单
    let addMenuForm = index =>{
        let obj = { ...startMenuForm  }
        obj.hierarchy = index + 1;
        switch (obj.hierarchy){
            case 1:
                obj.msg = '添加顶级菜单';
                break
            case 2:
                obj.msg = '添加二级菜单';
                break
            case 3:
                obj.msg = '添加三级菜单';
                break
        }
        setStartMenuForm(obj)
    }

    // 更新菜单
    let updateMenuForm = data=>{
        editMenu( { ...data,children:JSON.parse(data.children),astrict:JSON.parse(data.astrict),msg:'修改菜单：'+ data.title } )
    }

    // 删除菜单
    let deleteMenu = id=>{
        confirm({
            title: '确定删除当前菜单吗?',
            ...confirmMsg,
            onOk() {
                deleteMenuApi({id}).then(res=>{
                    message.success(res.msg);
                    getMenuList()
                })
            },
        });
    }

    useEffect(()=>{
        editMenu( startMenuForm )
    }, [ startMenuForm ])

    useEffect(()=>{
        getMenuList();
        addMenuForm(0)
    }, [ updateStatus ])

    return (
        <div style={{ height : "calc(100vh - 56px - 40px - 10px)",overflow:"hidden auto" }}>
            {
                allMenuList.length && allMenuList.map((item,index)=>{
                    return (
                        <Card
                            key={ index }
                            title={ titleList[index] }
                            extra={<Button type="link" onClick={ _=>addMenuForm(index) }>添加菜单</Button>}
                            style={{ marginBottom:"20px" }}
                        >
                            {
                                item.map( i =>{
                                    return (
                                        <div className={ styles.link } key={ i.id }>
                                            <Button
                                                type={i.conclude?'text':'link'}
                                                title={i.conclude?'已被纳入上级菜单中':'未被纳入上级菜单中'}
                                                onClick={ _=>updateMenuForm(i) }
                                            >
                                                { i.title }
                                            </Button>
                                            <Button style={{ display : i.name !== 'home'?'block':'none' }} type="link" danger onClick={ _=>{ deleteMenu(i.id) } }>
                                                删除
                                            </Button>
                                        </div>
                                    )
                                })
                            }
                        </Card>
                    )
                })
            }
        </div>
    )
}
