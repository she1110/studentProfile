import React, {useRef, useState} from 'react';
import {DownOutlined, UploadOutlined,} from '@ant-design/icons';
import {Button, Dropdown, Menu, message, Select, Upload,} from 'antd';
import type {ActionType, ProColumns} from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {useRequest} from 'umi';
import type {ProFormInstance} from '@ant-design/pro-form';

const {Option} = Select;

type GithubIssueItem = {
  url: string;
  id: number;
  number: number;
  title: string;
  labels: {
    name: string;
    color: string;
  }[];
  state: string;
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at?: string;
};

export default () => {
  const actionRef = useRef<ActionType>();
  const ref = useRef<ProFormInstance>();
  const [marjorOption, setMarjorOption] = useState([]);
  const [classOption, setClassOption] = useState([]);
  const props = {
    name: 'file',
    action: 'http://10.1.40.84:7878/uploadData',
    headers: {
      Authorization: localStorage.getItem('token') || '',
    },
    showUploadList: false,
    accept: ['.xlsx', '.xls'],
  };

  const UploadOnChange = (info: any, tableName: any) => {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      console.log(info.file.response.data);
      dataImport.run({
        fileName: info.file.response.data,
        tableName: tableName,
      });
      message.success(`${info.file.name} 文件上传成功`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 文件上传失败.`);
    }
  };
  const menu = (
    <Menu
      onClick={(e) => {
        window.open(e.key);
      }}
      items={[
        {
          label: '奖学金-模板',
          key: 'http://10.1.40.84:7878/file/model/%E5%A5%96%E5%AD%A6%E9%87%91-%E6%A8%A1%E6%9D%BF.xlsx',
        },
        {
          label: '励志奖学金-模板',
          key: 'http://10.1.40.84:7878/file/model/%E5%8A%B1%E5%BF%97%E5%A5%96%E5%AD%A6%E9%87%91-%E6%A8%A1%E6%9D%BF.xlsx',
        },
        {
          label: '贫困生-模板',
          key: 'http://10.1.40.84:7878/file/model/%E8%B4%AB%E5%9B%B0%E5%AD%A6%E7%94%9F-%E6%A8%A1%E6%9D%BF.xlsx',
        },
        {
          label: '助学金-模板',
          key: 'http://10.1.40.84:7878/file/model/%E5%8A%A9%E5%AD%A6%E9%87%91-%E6%A8%A1%E6%9D%BF.xlsx',
        },
      ]}
    />
  );
  const menu1 = (
    <Menu
      items={[
        {
          label: (
            <Upload
              key="upload"
              {...props}
              onChange={(info) => UploadOnChange(info, 'jiangxuejin')}
            >
              奖学金
            </Upload>
          ),
          key: 'jiangxuejin',
        },
        {
          label: (
            <Upload
              key="upload"
              {...props}
              onChange={(info) => UploadOnChange(info, 'lizhi')}
            >
              励志奖学金
            </Upload>
          ),
          key: 'lizhi',
        },
        {
          label: (
            <Upload
              key="upload"
              {...props}
              onChange={(info) => UploadOnChange(info, 'pinkun')}
            >
              贫困生
            </Upload>
          ),
          key: 'pinkun',
        },
        {
          label: (
            <Upload
              key="upload"
              {...props}
              onChange={(info) => UploadOnChange(info, 'zhuxuejin')}
            >
              助学金
            </Upload>
          ),
          key: 'zhuxuejin',
        },
      ]}
    />
  );

  const columns: ProColumns<GithubIssueItem>[] = [
    {
      title: '学号',
      dataIndex: 'USERID',
      hideInSearch: true,
      // valueType: 'indexBorder',
      // width: 48,
    },
    {
      title: '姓名',
      dataIndex: 'USERNAME',
      hideInSearch: true,
    },
    {
      disable: true,
      title: '性别',
      dataIndex: 'SEX',
      hideInSearch: true,
      filters: true,
      onFilter: true,
      valueType: 'select',
      valueEnum: {
        '1': {text: '男', color: 'blue'},
        '2': {text: '女', color: 'green'},
      },
    },
    {
      title: '班级',
      dataIndex: 'CLASSNAME',
      hideInSearch: true,
      // copyable: true,
      // ellipsis: true,
      // tip: '标题过长会自动收缩',
      // formItemProps: {
      //     rules: [
      //         {
      //             required: true,
      //             message: '此项为必填项',
      //         },
      //     ],
      // },
    },
    {
      title: '专业',
      dataIndex: 'MAJORNAME',
      hideInSearch: true,
    },
    {
      title: '政治面貌',
      dataIndex: 'POLITICS',
      hideInSearch: true,
    },
    {
      title: '辅导员',
      dataIndex: 'COUNSELORID',
      hideInSearch: true,
    },
    {
      title: 'GPA',
      dataIndex: 'GPA',
      hideInSearch: true,
      render: (text: any) => {
        return <span>{text.toFixed(4)}</span>;
      },
    },
    {
      title: '专业',
      dataIndex: 'majorid',
      hideInTable: true,
      renderFormItem: (
        _,
        {type, defaultRender, formItemProps, fieldProps, ...rest},
        form,
      ) => {
        return (
          <Select
            onSearch={(str: any) => {
              getLike.run({
                str: str,
                id: 8,
              });
            }}
            showSearch
            defaultActiveFirstOption={false}
            filterOption={false}
            allowClear
          >
            {marjorOption.map((item: any) => {
              return (
                <Option value={item?.VALUE} key={item?.VALUE}>
                  {item?.LABEL}
                </Option>
              );
            })}
          </Select>
        );
      },
    },
    {
      title: '班级',
      dataIndex: 'classid',
      hideInTable: true,
      renderFormItem: (
        _,
        {type, defaultRender, formItemProps, fieldProps, ...rest},
        form,
      ) => {
        return (
          <Select
            onSearch={(str: any) => {
              getLike.run({
                str: str,
                id: 10,
              });
            }}
            showSearch
            defaultActiveFirstOption={false}
            filterOption={false}
          >
            {classOption.map((item: any) => {
              return (
                <Option value={item?.VALUE} key={item?.VALUE}>
                  {item?.LABEL}
                </Option>
              );
            })}
          </Select>
        );
      },
    },
    {
      title: '励志奖',
      dataIndex: 'lzj',
      hideInTable: true,
      valueType: 'select',
      valueEnum: {
        '1': {text: '获得'},
      },
    },
    {
      title: '奖学金',
      dataIndex: 'jxj',
      hideInTable: true,
      valueType: 'select',
      valueEnum: {
        国家奖学金: {text: '国家奖学金'},
      },
    },
    {
      title: '贫困生',
      dataIndex: 'pks',
      hideInTable: true,
      valueType: 'select',
      valueEnum: {
        一般困难: {text: '一般困难'},
        困难: {text: '困难'},
        特殊困难: {text: '特殊困难'},
      },
    },
    {
      title: '助学金',
      dataIndex: 'zxj',
      hideInTable: true,
      valueType: 'select',
      valueEnum: {
        '1': {text: '获得'},
      },
    },
  ];
  //查询
  const identifySearch = useRequest(
    (data = {}) => {
      return {
        url: 'http://10.1.40.84:8072/identifySearch',
        method: 'POST',
        headers: {
          Authorization: localStorage.getItem('token') || '',
        },
        data,
      };
    },
    {
      onSuccess: (result, params) => {
        console.log(result);
      },
      onError: (e, params) => {
        console.log(e);
        console.log(params);
      },
      // manual: true,
    },
  );
  //专业模糊查询
  const getLike = useRequest(
    (
      data = {
        id: 8,
        str: '',
      },
    ) => {
      return {
        url: `http://10.1.40.84:7878/label/getLike?id=${data.id}&str=${data.str}`,
        method: 'GET',
        headers: {
          Authorization: localStorage.getItem('token') || '',
        },
        data,
      };
    },
    {
      onSuccess: (result, params) => {
        console.log(result);
        console.log(params);
        if (params[0].id === 8) {
          setMarjorOption(result);
        }
        if (params[0].id === 10) {
          setClassOption(result);
        }
      },
      onError: (e, params) => {
        console.log(e);
        console.log(params);
      },
      manual: true,
    },
  );

  //上传模版 返回地址 再传给后端
  const dataImport = useRequest(
    (data = {}) => {
      return {
        url: 'http://10.1.40.84:7878/dataImport',
        method: 'POST',
        headers: {
          Authorization: localStorage.getItem('token') || '',
        },
        data,
      };
    },
    {
      onSuccess: (result, params) => {
        console.log(result);
        identifySearch.run();
      },
      onError: (e, params) => {
        console.log(e);
        console.log(params);
      },
      manual: true,
    },
  );

  const onSubmit = (value: any) => {
    console.log(value);
    ref.current?.validateFields().then((formdata: any) => {
      console.log(formdata);
      identifySearch.run(formdata);
    });
  };
  return (
    <>
      {/* <Button onClick={() => {
                console.log(identifySearch.data);

            }}>ceshi</Button> */}
      <ProTable<GithubIssueItem>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        dataSource={identifySearch?.data ? identifySearch.data : []}
        loading={identifySearch.loading}
        onSubmit={onSubmit}
        formRef={ref}
        rowKey="USERID"
        search={{
          defaultCollapsed: true,
          labelWidth: 'auto',
          span: 6,
        }}
        dateFormatter="string"
        headerTitle="学生列表"
        toolBarRender={() => [
          // <Button key="button" icon={<PlusOutlined />} type="primary" onClick={() => {
          //     DownloadExcel(
          //         columns,
          //         identifySearch?.data,
          //         `三助一奖学生列表${moment().format('YYYYMMDDHHmmss')}`,
          //         [],
          //         () => {
          //             setTimeout(() => {
          //                 notification.success({ message: '导出成功!' });
          //             }, 300);
          //         },
          //     );
          // }}>
          //     导出Excel
          // </Button>,
          <Dropdown overlay={menu}>
            <Button key="download">
              下载模版
              <DownOutlined/>
            </Button>
          </Dropdown>,
          <Dropdown overlay={menu1}>
            <Button key="upload">
              上传数据
              <UploadOutlined/>
            </Button>
          </Dropdown>,
        ]}
      />
    </>
  );
};
