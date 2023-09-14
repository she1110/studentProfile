import type { TableColumnsType } from 'antd';
import React, {useEffect, useState} from 'react';
import {ColumnsType} from "antd/es/table";
import {Popconfirm, Space, Table} from "antd";
/*
表格数据
 */
interface DataType {
  key: string;
  profileName: string;
  profileId: string;
}

const DashBoardHaveIn = (params:any) =>{
  //定义表格列的属性
  const columns: ColumnsType<DataType> = [
    {
      title: '分群名',
      dataIndex: 'profileName',
      key: 'profileName',
      width:'33%',
      align:"center"
    },
    {
      title: '分群ID',
      dataIndex: 'profileId',
      key: 'profileId',
      width:'33%',
      align:"center",
      sorter: (a, b) => a.profileId - b.profileId,
    },
    {
      title: 'Action',
      key: 'action',
      width:'33%',
      align:"center",
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm title="确认要删除吗？" onConfirm={()=>{params.deleteDashBoardHaveIn(record)}} okText="确认" cancelText="取消">
            <a href="#" style={{color:"red"}} >删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  const data: DataType[] = params.data;
  return (
    <Table columns={columns} dataSource={data} pagination={false} scroll={{y: 300}}/>
  )
}

export default DashBoardHaveIn;
