import { Table } from 'antd';

export default (props)=>{
    let { setSearchForm , columns , dataSource , searchForm , total , expandable , show , activeList , setActiveList} = props;
    let  handleSizeChange = ( page, pageSize )=>{
        // 判断pagesize是否发生了变化，如果是则将page改成1；
        setSearchForm({
            ...searchForm,
            page: pageSize !== searchForm.pageSize? 1 : page,
            pageSize,
        })
    }

    // 选中的方法
    let onSelectChange = (newSelectedRowKeys) => {
        setActiveList(newSelectedRowKeys)
    };

    let  rowSelection = {
        activeList,
        onChange: onSelectChange,
    };

    return (
        <Table
            style={{ display: show?'none':'block' }}
            bordered
            rowKey={ row => row.id }
            rowSelection={ rowSelection }
            columns={ columns }
            dataSource = { dataSource }
            expandable={
                expandable?{
                    expandedRowRender:( row )=> expandable(row)
                } :''
            }
            pagination={{
                current: searchForm.page,
                pageSize: searchForm.pageSize,
                total,
                showTotal:(total) => `共${total}条数据`,
                onChange : handleSizeChange
            }}
        />
    )
}
