import {Button, Card, Col, Divider, Form, Input, PageHeader, Row, Select, Space, Table, Tag, TreeSelect} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, {useEffect} from 'react';
import {useState} from 'react';
import ResponsibilityManageWindow from'./components/ResponsibilityManageWindow/index'
import {connect, Dispatch} from "umi";
/*
表格数据
 */


interface TeachersListType {
  key: string;
  accountName: string;
  accountId: string;
  roleName: string;
  profileName: string;
}

/*
函数组件
 */
const CrowdManagement = (props:any) => {
  /*
  获取初始信息
  ----------------------------------------------------------------------------------------------------------------------
   */
  //定义表格列的属性
  const columns: ColumnsType<TeachersListType> = [
    {
      title: '姓名',
      dataIndex: 'accountName',
      key: 'accountName',
      width:'20%',
      align:"center"
    },
    {
      title: '工号',
      dataIndex: 'accountId',
      key: 'accountId',
      width:'20%',
      align:"center"
    },
    {
      title: '职务',
      dataIndex: 'roleName',
      key: 'roleName',
      width:'20%',
      align:"center"
    },
    {
      title: '管理中的分群',
      dataIndex: 'profileName',
      key: 'profileName',
      width:'25%',
      align:"center"
    },
    {
      title: 'Action',
      key: 'action',
      width:'20%',
      align:"center",
      render: (_, record) => (
        <Space size="middle">
          <a onClick={()=>{openWindow(record)}}>查看管理人群</a>
        </Space>
      ),
    },
  ];
  //用于控制弹窗的显示
  const [windowFlag, setWindowFlag] = useState(false);
  //表格所选择行的数据
  const [rowRecord, setRowRecord] = useState();
  //教师数据列表
  const [teachersList,setTeachersList] = useState<TeachersListType>()
  //form表单
  const [searchTeacherform] = Form.useForm();
  /*
  ----------------------------------------------------------------------------------------------------------------------
  获取初始信息
 */

  /*
  函数功能
  ----------------------------------------------------------------------------------------------------------------------
   */
  //获取教师信息函数
  const getTeachersInfo = () => {
    if (props.dispatch){
      props.dispatch({
        type: 'Model_CrowdManagementType/getTeacherListFromServices',
        payload: {
          value:{
            accountId: "",
            accountName: "",
            roleId: ""
          },
          callback: (value: any) => {
            setTeachersList(value)
          },
        },
      })
    }
  }
  //点击按钮之后用于显示弹窗
  const openWindow = (rowRecord:any) =>{
    setRowRecord(rowRecord)
    return (
      setWindowFlag(!windowFlag)
    )
  }
  //搜索按钮
  const onSearchTeacher = (value:any) => {
    if (props.dispatch){
      props.dispatch({
        type: 'Model_CrowdManagementType/getTeacherListFromServices',
        payload: {
          value:value,
          callback: (value: any) => {
            setTeachersList(value)
            console.log(value)
          },
        },
      })
    }
  }
  //重置按钮
  const onSearchTeacherReset = () => {
    searchTeacherform.resetFields()
    getTeachersInfo()
  }
  /*
  ----------------------------------------------------------------------------------------------------------------------
  函数功能
 */

  /*
  渲染页面
  ----------------------------------------------------------------------------------------------------------------------
   */
  useEffect(()=>{
    getTeachersInfo()
  },[])
  /*
  ----------------------------------------------------------------------------------------------------------------------
  渲染页面
   */


  return (
    <div style={{padding: 30, background: ' #ececec', width: '100%'}}>

      {/*搜索表单功能...*/}
      <Space direction="vertical" style={{width: '100%'}}>
        <PageHeader className="site-page-header" ghost={false} title="责任管理" >
          {/*分割线，美观*/}
          <Divider/>
          {/*表单*/}
          <Form form={searchTeacherform} onFinish={onSearchTeacher}>
            <Row gutter={[16, 0]}>
              <Col>
                <Form.Item label="工号" name="accountId">
                  <Input/>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item label="姓名" name="accountName">
                  <Input/>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item label="职务" name="roleId">
                  <Select style={{width: 170}}>
                  </Select>
                </Form.Item>
              </Col>
              <Col>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
              </Col>
              <Col>
                <Button type="primary" htmlType="button" onClick={onSearchTeacherReset}>
                  重置
                </Button>
              </Col>
            </Row>
          </Form>
        </PageHeader>
      </Space>
      {/*搜索表单功能...*/}

      {/*弹窗...*/}
      <ResponsibilityManageWindow rowRecord={rowRecord} windowFlag={windowFlag} setWindowFlag={setWindowFlag} />
      {/*弹窗...*/}

      {/*表格...*/}
      <Space direction="vertical" style={{width: '100%'}}>
        <Card title="角色管理">
          <Table columns={columns} dataSource={teachersList}/>
        </Card>
      </Space>
      {/*表格...*/}

    </div>
  )
};

export default connect(({ Model_CrowdManagementType }: any) => ({
  Model_CrowdManagementType
}))(CrowdManagement);
