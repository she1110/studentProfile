import React, {Component, useEffect, useState} from 'react';
import { DownloadOutlined} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Form,
  Input,
  PageHeader,
  Row,
  Select,
  Cascader,
  Tag,
  Typography,
  Col,
  Space,
  Table, message,
} from 'antd';

import type { ColumnsType } from 'antd/es/table';
// @ts-ignore
import Pic1 from '@/assets/picture/问卷.png'
import {connect} from "umi";
//要大写
const { Paragraph } = Typography;//说明文字的标签
//表格数据
interface DataType {
  key: string;
  name: string,
  year:string;
  status:string;
  handler: string;
}
//连接所需参数格式
interface UrlInfoType {
  Time: string;
  Name: string,
  PersonCode:string;
  ProductName: string;
  ProductCode: string;
}

const DownloadCharacterAnalysisReport = (props:any)=> {
  /*
  数据
  ----------------------------------------------------------------------------------------------------------------------
   */
  //报告名和报告id的对应关系
  const [report,setReport] = useState<any[]>([
    {
      ProductCode: "416914",
      ProductName: "EQT情商测验"
    },
    {
      ProductCode: "416913",
      ProductName: "MAP职业性格测验(大学生通用版V3.0)"
    },
    {
      ProductCode: "416912",
      ProductName: "IQCAT思维能力自适应测验"
    },
  ]);
  //表格数据格式
  const columns: ColumnsType<DataType> = [
    {
      title: '考察项',
      align:'center',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '年份',
      align:'center',
      dataIndex: 'year',
      key: 'year',
    },
    {
      title: '状态',
      align:'center',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: '附件',
      align:'center',
      dataIndex: 'handler',
      key: 'handler',
      render: (_, record) => {
        let status = true
        if (record.status === "未生成")status = false
        return (
          <Space size="middle">
          <a onClick={()=>{previewReport(status, record.key,record.name)}}>预览</a>
          <a onClick={()=>{downloadReport(status, record.key,record.name)}}>下载</a>
        </Space>)
      }
    },
  ];
  //表格数据
  const [tableData,setTableData] = useState<any[]>([]);
  //用户信息
  const [currentUserInfo,setCurrentUserInfo] = useState<any>();
  /*
  ----------------------------------------------------------------------------------------------------------------------
  数据
   */

  /*
  方法
  ----------------------------------------------------------------------------------------------------------------------
   */
  //获取用户信息
  const getUserInfo = () => {
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
  //获取报告列表
  const getReportList = () => {
    if (props.dispatch){
      props.dispatch({
        //路径：model的namespace+effects函数名
        type: 'Model_CharacterAnalysisForTeacherModel/getQuestionnaireListEffects',
        payload: {
          PersonCode: currentUserInfo.PersonCode,
          callback: (list: any) => {
            console.log(list)
            let dataList = []
            for (let i = 0; i < list.length; i++) {
              let name = ''
              let status = "未生成"
              console.log(list[i].status)
              if (list[i].status === 1)status="已生成"
              for (let j = 0; j < report.length; j++) if (list[i].productCode === report[j].ProductCode)name = report[j].ProductName
              let data = {
                key: list[i].productCode,
                name: name,
                year:list[i].latelyApplyTime.slice(0,4),
                status:status,
                handler:''
              }
              dataList.push(data)
            }
            setTableData(dataList)
            console.log(dataList)
          },
        },
      })
    }
  }
  //获取下载报告的链接并跳转
  const downloadReport = (status:any, id:any,name:any) => {
    if (!status){
      message.warning("尚未生成报告，请稍后重试")
      return
    }else {
      let currentUrlInfo= {
        Time: new Date().getFullYear(),
        Name: currentUserInfo.Name,
        PersonCode:currentUserInfo.PersonCode,
        ProductName: name,
        ProductCode: id,
      }
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
  }
  //获取预览报告的链接并跳转
  const previewReport = (status:any, id:any,name:any) => {
    if (!status){
      message.warning("尚未生成报告，请稍后重试")
      return
    }else {
      let currentUrlInfo= {
        Time: new Date().getFullYear(),
        Name: currentUserInfo.Name,
        PersonCode:currentUserInfo.PersonCode,
        ProductName: name,
        ProductCode: id,
      }
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
  }
  /*
  ----------------------------------------------------------------------------------------------------------------------
  数据
   */

  /*
  渲染界面
  ----------------------------------------------------------------------------------------------------------------------
 */
  useEffect(()=>{
    getUserInfo()
  },[])

  useEffect(()=>{
    if (currentUserInfo){
      getReportList()
    }
  },[currentUserInfo])
  /*
  ----------------------------------------------------------------------------------------------------------------------
  渲染界面
   */



  //学生图像标签定义
  const Content = ({ children, extraContent }: any) => (
    <Row>
      <div style={{ flex: 1 }}>{children}</div>
      <div className="image">{extraContent}</div>
    </Row>
  );
  //毕业意向调查表渲染页面
  return (
    <div style={{ padding: 30, background: ' #ececec', width: '100%' }}>
      {/*学生页面填写模块标题*/}
      <div style={{ marginBottom: 30, backgroundColor: 'white' }}>
        <Table columns={columns} dataSource={tableData} />
      </div>
    </div>
  );
}

//连接的参数名必须是model的namespace
export default connect(({ Model_CharacterAnalysisForTeacherModel }: any) => ({
  Model_CharacterAnalysisForTeacherModel
}))(DownloadCharacterAnalysisReport);
