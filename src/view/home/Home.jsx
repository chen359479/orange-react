import { useState , useEffect } from 'react';
import { Card } from 'antd';
import { Gauge } from '@ant-design/plots';

import { systemInfo } from '@/api/system';
import styles from './home.module.css'

const gaugeDom = ( percent ) => {
    const config = {
        percent,
        type: 'meter',
        innerRadius: 0.75,
        range: {
            ticks: [0, 1 / 3, 2 / 3, 1],
            color: ['#30BF78' , '#FAAD14' ,  '#F4664A'],
        },
        indicator: {
            pointer: {
                style: {
                    stroke: '#D0D0D0',
                },
            },
            pin: {
                style: {
                    stroke: '#D0D0D0',
                },
            },
        },
        statistic: {
            content: {
                style: {
                    fontSize: '36px',
                    lineHeight: '36px',
                },
            },
        },
    };
    return <Gauge {...config} />;
};

export default () => {
    const [ data , setData ] = useState({});
    const [ diskData , setDiskData ] = useState([]);

    useEffect(()=>{
        systemInfo().then(res=>{
            setData( res.data )
            setDiskData([
                {
                    title:'内存:',
                    value:((res.data.totalmem-res.data.freemem)/res.data.totalmem)*100
                },
                ... res.data.aDrives.map(item=> {
                    return {
                        title: item.mounted,
                        value: parseInt(item.capacity)
                    }
                })
            ])
        })

    },[])

    return (
        <div className={styles.home}>
            <Card style={{marginTop:'0'}}>
                <div className={styles.info}>
                    <span>主机名称: { data.hostname } </span>
                    <span>CPU数量: { data.cpuCount }核 </span>
                    <span>处理器架构: { data.arch } </span>
                    <span>操作系统: { data.type } </span>
                </div>
            </Card>
            <Card title="内存使用情况：">
                <div className={styles.info}>
                    <span>总内存: {Math.ceil(data.totalmem / 1024)}G </span>
                    <span>空闲内存: {(data.freemem / 1024).toFixed(2)}G </span>
                    <span>可用内存百分比: {((data.freemem / data.totalmem) * 100).toFixed(2) + '%'} </span>
                </div>
            </Card>
            <Card title="磁盘使用情况：">
                {
                    data.aDrives && data.aDrives.map(item=>{
                        return (
                            <div className={styles.info} key={item.mounted + Math.random()}>
                                <span>磁盘名称: { item.mounted }盘 </span>
                                <span>磁盘总容量: { item.blocks } </span>
                                <span>可用容量: { item.available } </span>
                                <span>已用容量百分比: { item.capacity } </span>
                            </div>
                        )
                    })
                }
            </Card>
            <Card>
                <div className={styles.info}>
                    {
                        diskData && diskData.map(item=>{
                            return (
                                <div className={styles.charts} key={ item.title + Math.random() }>
                                    <h3 >{item.title}</h3>
                                    {gaugeDom(item.value/100)}
                                </div>
                            )
                        })
                    }
                </div>
            </Card>
        </div>
    )
}
