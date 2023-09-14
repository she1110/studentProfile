import React, {useEffect, useImperativeHandle, useState} from 'react';
import {Button, Col, Form, Input, message, Row, Select, Space, Table, Tag} from 'antd';
import type {ColumnsType, TableProps} from 'antd/es/table';
import {FormInstance} from "antd/lib/form";
import type {  FilterValue, SorterResult } from 'antd/es/table/interface';
import {connect} from "umi";
interface DataType {
  key: string;
  testInvokeKey: string;
  name: string;
  stuId: string;
  className: string;
  status: string;
  year: string;
  productName: string;
}

const StudentTableData = (props:any) => {
  /*
 数据初始化
 ----------------------------------------------------------------------------------------------------------------------
  */
  //用户信息
  const [currentUserInfo,setCurrentUserInfo] = useState<any>();
  //表单信息
  const formRef = React.useRef<FormInstance>(null);
  const questionaireType = [{ value: 'IQCAT思维能力自适应测验', label: 'IQCAT思维能力自适应测验' }, { value: 'MAP职业性格测验(大学生通用版V3.0)', label: 'MAP职业性格测验(大学生通用版V3.0)' }, { value: 'EQT情商测验', label: 'EQT情商测验' }]
  //自动排序筛选的控制
  const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({});
  const [sortedInfo, setSortedInfo] = useState<SorterResult<DataType>>({});
  //数据
  const [data, setData] = useState<DataType[]>([])
  const columns: ColumnsType<DataType> = [
    {
      title: '姓名',
      align:'center',
      dataIndex: 'name',
      // filters: Array.from(new Set(data.map(({ name }) => JSON.stringify({ text: name, value: name })))).map(str => JSON.parse(str)),
      // filteredValue: filteredInfo.name || null,
      key: 'name',
      render: (text) => <a>{text}</a>,
      sorter:{
        compare: (a, b) => a.name.localeCompare(b.name),
        multiple: 5,
      },
      sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
      onFilter: (value: any, record:DataType) => record.name.indexOf(value) === 0,
    },
    {
      title: '学号',
      align:'center',
      dataIndex: 'stuId',
      // filters: data.map(({ stuId }) => ({ text: stuId, value: stuId })),
      // filteredValue: filteredInfo.stuId || null,
      key: 'stuId',
      sorter: {
        // @ts-ignore
        compare: (a, b) => a.stuId - b.stuId,
        multiple: 5,
      },
      sortOrder: sortedInfo.columnKey === 'stuId' ? sortedInfo.order : null,
      onFilter: (value: any, record:DataType) => record.stuId.indexOf(value) === 0,
    },
    {
      title: '班级',
      align:'center',
      dataIndex: 'className',
      filters: Array.from(new Set(data.map(({ className }) => JSON.stringify({ text: className, value: className })))).map(str => JSON.parse(str)),
      filteredValue: filteredInfo.class || null,
      key: 'class',
      sorter: {
        compare: (a, b) => a.className.localeCompare(b.className),
        multiple: 3,
      },
      sortOrder: sortedInfo.columnKey === 'class' ? sortedInfo.order : null,
      onFilter: (value: any, record:DataType) => record.className.indexOf(value) === 0,
    },
    {
      title: '问卷类型',
      align:'center',
      dataIndex: 'productName',
      filters: Array.from(new Set(data.map(({ productName }) => JSON.stringify({ text: productName, value: productName })))).map(str => JSON.parse(str)),
      filteredValue: filteredInfo.productName || null,
      key: 'productName',
      sorter: {
        compare: (a, b) => a.productName.localeCompare(b.productName),
        multiple: 2,
      },
      sortOrder: sortedInfo.columnKey === 'productName' ? sortedInfo.order : null,
      onFilter: (value: any, record:DataType) => record.productName.indexOf(value) === 0,
    },
    {
      title: '年份',
      align:'center',
      dataIndex: 'year',
      filters: Array.from(new Set(data.map(({ year }) => JSON.stringify({ text: year, value: year })))).map(str => JSON.parse(str)),
      filteredValue: filteredInfo.year || null,
      key: 'year',
      sorter: {
        // @ts-ignore
        compare:(a, b) => a.year - b.year,
        multiple: 1,
      },
      sortOrder: sortedInfo.columnKey === 'year' ? sortedInfo.order : null,
      onFilter: (value: any, record:DataType) => record.year.indexOf(value) === 0,
    },
    {
      title: '问卷状态',
      align:'center',
      dataIndex: 'status',
      filters: Array.from(new Set(data.map(({ status }) => JSON.stringify({ text: status, value: status })))).map(str => JSON.parse(str)),
      filteredValue: filteredInfo.status || null,
      key: 'status',
      sorter: {
        compare: (a, b) => a.status.localeCompare(b.status),
        multiple: 4,
      },
      sortOrder: sortedInfo.columnKey === 'status' ? sortedInfo.order : null,
      onFilter: (value: any, record:DataType) => record.status.indexOf(value) === 0,
    },
    {
      title: '附件',
      align:'center',
      dataIndex: 'handler',
      key: 'handler',
      render: (_, record) => {
        let status = true
        if (record.status === "未完成")status = false
        return (
          <Space size="middle">
            <a onClick={()=>{previewReport(status, record.year, record.name, record.stuId, record.testInvokeKey, record.productName)}}>预览</a>
            <a onClick={()=>{downloadReport(status, record.year, record.name, record.stuId, record.testInvokeKey, record.productName)}}>下载</a>
          </Space>)
      }
    },
  ];
  /*
  ----------------------------------------------------------------------------------------------------------------------
  数据初始化
   */

  /*
  方法函数
  ----------------------------------------------------------------------------------------------------------------------
   */
  //返回表格变化数据
  const handleChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
    setFilteredInfo(filters);
    setSortedInfo(sorter as SorterResult<DataType>);
  };
  //获取下载报告的链接并跳转
  const downloadReport = (status:any, Time:any, Name:any, PersonCode:any, ProductCode:any, ProductName:any) => {
    if (!status){
      message.warning("尚未生成报告，请稍后重试")
      return
    }else {
      let currentUrlInfo= {
        Time: Time,
        Name: Name,
        PersonCode:PersonCode,
        ProductName: ProductName,
        ProductCode: ProductCode,
      }
      downloadReportFromEffects(currentUrlInfo)
    }
  }
  //获取预览报告的链接并跳转
  const previewReport = (status:any, Time:any, Name:any, PersonCode:any, ProductCode:any, ProductName:any) => {
    if (!status){
      message.warning("尚未生成报告，请稍后重试")
      return
    }else {
      let currentUrlInfo= {
        Time: Time,
        Name: Name,
        PersonCode:PersonCode,
        ProductName: ProductName,
        ProductCode: ProductCode,
      }
      previewReportFromEffects(currentUrlInfo)
    }
  }
  //清除所有筛选和排序条件
  const clearAll = () => {
    setFilteredInfo({});
    setSortedInfo({});
  };
  //重置表单
  const onReset = () => {
    formRef.current?.resetFields();
    clearAll()
    setData(JSON.parse(JSON.stringify(props.Model_CharacterAnalysisForTeacherModel.listForTeacher)))
  };
  //模糊查询
  const onSearch = (num:any, value:any, data: any) => {
    if (value === "")return
    else {
      let dataCopy: any = []
      switch (num) {
        case 1:
          for (let i = 0; i < data.length; i++) {
            if (data[i].className.includes(value)) {
              let className = {
                key: data[i].key,
                name: data[i].name,
                stuId: data[i].stuId,
                className: data[i].className,
                productName: data[i].productName,
                year: data[i].year,
                status: data[i].status,
                testInvokeKey: data[i].testInvokeKey,
              }
              dataCopy.push(className)
            }
          }
        case 2:
          for (let i = 0; i < data.length; i++) {
            if (data[i].name.includes(value)) {
              let name = {
                key: data[i].key,
                name: data[i].name,
                stuId: data[i].stuId,
                className: data[i].className,
                productName: data[i].productName,
                year: data[i].year,
                status: data[i].status,
                testInvokeKey: data[i].testInvokeKey,
              }
              dataCopy.push(name);
            }
          }
        case 3:
          for (let i = 0; i < data.length; i++) {
            if (data[i].stuId.includes(value)) {
              let stuId = {
                key: data[i].key,
                name: data[i].name,
                stuId: data[i].stuId,
                className: data[i].className,
                productName: data[i].productName,
                year: data[i].year,
                status: data[i].status,
                testInvokeKey: data[i].testInvokeKey,
              }
              dataCopy.push(stuId)
            }
          }
        case 4:
          for (let i = 0; i < data.length; i++) {
            if (data[i].productName.includes(value)) {
              let productName = {
                key: data[i].key,
                name: data[i].name,
                stuId: data[i].stuId,
                className: data[i].className,
                productName: data[i].productName,
                year: data[i].year,
                status: data[i].status,
                testInvokeKey: data[i].testInvokeKey,
              }
              dataCopy.push(productName)
            }
          }
      }
      return dataCopy;
    }
  }
  //通过表单项搜索
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////未完成
  const searchByFormData = (values: any) => {
    //{class: undefined, username: "10086", stuId: undefined, productName: undefined}
    console.log(JSON.parse(JSON.stringify(props.Model_CharacterAnalysisForTeacherModel.listForTeacher)))
    let dataCopy = JSON.parse(JSON.stringify(props.Model_CharacterAnalysisForTeacherModel.listForTeacher))
    if (values.className)dataCopy = onSearch(1, values.className, dataCopy)
    if (values.name)dataCopy = onSearch(2, values.name, dataCopy)
    if (values.stuId)dataCopy = onSearch(3, values.stuId, dataCopy)
    if (values.productName)dataCopy = onSearch(4, values.productName, dataCopy)
    setData(dataCopy)
  }
  /*
  ----------------------------------------------------------------------------------------------------------------------
  方法函数
   */

  /*
  异步请求
  ----------------------------------------------------------------------------------------------------------------------
   */
  //获取下载报告的链接并跳转
  const downloadReportFromEffects = (currentUrlInfo:any) => {
    if (props.dispatch){
      props.dispatch({
        //路径：model的namespace+effects函数名
        type: 'Model_CharacterAnalysisForTeacherModel/getReportEffects',
        payload: {
          currentUrlInfo: currentUrlInfo,
          callback: (url: any) => {
            // window.open(url)
          },
        },
      })
    }
  }
  //获取预览报告的链接并跳转
  const previewReportFromEffects = (currentUrlInfo:any) => {
    if (props.dispatch){
      props.dispatch({
        //路径：model的namespace+effects函数名
        type: 'Model_CharacterAnalysisForTeacherModel/getPreviewEffects',
        payload: {
          currentUrlInfo: currentUrlInfo,
          callback: (url: any) => {
            // window.open(url)
          },
        },
      })
    }
  }
  //获取用户信息
  const getUserInfoFromEffects = () => {
    if (props.dispatch){
      props.dispatch({
        //路径：model的namespace+effects函数名
        type: 'user/getcurrentuserinfo',
        payload: {
          callback: (result: any) => {
            let data = JSON.parse(result)
            setCurrentUserInfo({
              Name:data.userName,
              PersonCode:data.account
            })
          },
        },
      })
    }
  }
  /*
  ----------------------------------------------------------------------------------------------------------------------
  异步请求
   */


  /*
  渲染界面
  ----------------------------------------------------------------------------------------------------------------------
   */
  useEffect(()=>{
    getUserInfoFromEffects()
  },[])
  useEffect(()=>{
    setData(JSON.parse(JSON.stringify(props.Model_CharacterAnalysisForTeacherModel.listForTeacher)))
  },[props.Model_CharacterAnalysisForTeacherModel.listForTeacher])
  /*
  ----------------------------------------------------------------------------------------------------------------------
  渲染界面
   */


  return(
    <div>
      <Form
        name="basic"
        ref={formRef}
        onFinish={searchByFormData}
        // onFinishFailed={onFinishFailed}
      >
        <Row>
          <Col span={5}>
            <Form.Item label="班级" name="className" >
              <Input style={{width: 150}} placeholder="请输入班级"/>
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item label="姓名" name="name" >
              <Input style={{width: 150}} placeholder="请输入姓名"/>
            </Form.Item>
          </Col>
          <Col span={5} >
            <Form.Item label="学号" name="stuId" >
              <Input style={{width: 150}} placeholder="请输入学号"/>
            </Form.Item>
          </Col>
          <Col span={5} >
            <Form.Item label="问卷类型" name="productName" >
              <Select style={{ width: 150 }} options={questionaireType} />
            </Form.Item>
          </Col>
          <Col span={1.5}>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                搜索
              </Button>
            </Form.Item>
          </Col>
          <Col span={1}>
            <Form.Item>
              <Button htmlType="button" onClick={onReset}>
                重置
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Table columns={columns} dataSource={data} onChange={handleChange}/>
    </div>
  )

}
//连接的参数名必须是model的namespace
export default connect(({ Model_CharacterAnalysisForTeacherModel }: any) => ({
  Model_CharacterAnalysisForTeacherModel,
}))(StudentTableData);
