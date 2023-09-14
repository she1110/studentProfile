import {
  PageHeader,
  Space,
  Typography,
  Tabs, Tag, Button, Select
} from "antd";
import {connect} from "umi";
import React, {useEffect, useState} from "react";
import StudentTag from "@/pages/GraduationSurveyTeacher/components/StudentTag";
const {Paragraph} = Typography;

/*
流程说明：①初始化页面时获取用户账号accountId并存储到仓库，同时获取用户角色Id列表
②点击选择角色时存储角色id并获取各种图表的信息
 */
const GraduationSurveyTeacher = (props:any) => {
  /*
  数据初始化
  ----------------------------------------------------------------------------------------------------------------------
   */
  const content = (
    <>
      <Paragraph>
        就业意向调查是指在学生管理工作中，针对学生在学习中出现的不良情况，及时告知学生本人及其家长可能产生的不良后果，并有针对性的采取防范措施的一项制度。
      </Paragraph>
      <Paragraph>
        运行方式是通过学校、学生和家长之间的配合，确保信息沟通和危机预警渠道通畅，从而帮助学生顺利完成学业。
      </Paragraph>
      <Paragraph>
        就业意向调查不属于处分的类别，预警的目的为了尽最大的努力预先警示处于处分边缘、将有可能受到相应纪律处分的学生。
      </Paragraph>

    </>
  );
  const [accountId,setAccountId] = useState<any>('');
  const [roleList,setRoleList] = useState<any[]>([]);
  const [currentRoleId,setCurrentRoleId] = useState<any>();
  /*
  ----------------------------------------------------------------------------------------------------------------------
  数据初始化
   */

  /*
  异步请求
  ----------------------------------------------------------------------------------------------------------------------
   */
  //获取用户账号
  const getUserAccountId = () => {
    if (props.dispatch) {
      props.dispatch({
        type: 'user/getcurrentuserinfo',
        payload: {
          callback: (value: any) => {
            let newValue = JSON.parse(value)
            //设置账号
            setAccountId(newValue.account)
            //通过账号获取角色
            getRoles(newValue.account)
            //存储账号到仓库
            storeAccountId(newValue.account)
          },
        },
      });
    }
  }
  //获取当前用户角色
  const getRoles = (value:any) =>{
    if (props.dispatch) {
      props.dispatch({
        type: 'Model_GraduationSurveyTeacherModel/getRoleListByTeacherIdFromServices',
        payload: {
          value:value,
          callback: (value: any) => {
            //设置角色
            setRoleList(value)
          },
        },
      });
    }
  }
  //存储accountId
  const storeAccountId = (accountId:any) => {
    console.log(accountId)
    if (props.dispatch) {
      props.dispatch({
        type: 'Model_GraduationSurveyTeacherModel/setAccountIdReducer',
        payload: {
          value:accountId
        },
      });
    }
  }
  //存储currentRoleId
  const storeCurrentRoleId = (roleId:any) => {
    if (props.dispatch) {
      props.dispatch({
        type: 'Model_GraduationSurveyTeacherModel/setCurrentRoleIdReducer',
        payload: {
          value:roleId
        },
      });
    }
  }
  //获取叠状图数据
  const getColumnListFromServices = (value:any) => {
    if (props.dispatch) {
      props.dispatch({
        type: 'Model_GraduationSurveyTeacherModel/getColumnListFromServices',
        payload: {
          value:value
        },
      });
    }
  }
  //获取维度信息
  const getDimensionDataList = (value:any) => {
    if (props.dispatch) {
      props.dispatch({
        type: 'Model_GraduationSurveyTeacherModel/getDimensionDataListFromSerices',
        payload: {
          value:value
        },
      });
    }
  }
  //获取饼状图下拉框数据
  const getPieSelectOptionData = () => {
    if (props.dispatch) {
      props.dispatch({
        type: 'Model_GraduationSurveyTeacherModel/setIntentionData',
        payload: {
        },
      });
    }
  }
  //获取管理学生数据
  const getStudentData = (value: any) => {
    if (props.dispatch) {
      props.dispatch({
        type: 'Model_GraduationSurveyTeacherModel/getStudentListFromSerices',
        payload: {
          value: value,
        },
      });
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
    getUserAccountId()
  },[])
  useEffect(()=>{
  },[currentRoleId,accountId])
  /*
  ----------------------------------------------------------------------------------------------------------------------
  渲染界面
   */

  //点击选择角色后触发事件
  const roleSelectOnclick = (e:any) => {
    setCurrentRoleId(e)
    //存储账号和角色到仓库
    storeCurrentRoleId(e)
    //获取叠状图数据，参数名不可以变
    let currentUserInfo = {
      accountId:accountId,
      roleId:e
    }
    getColumnListFromServices(currentUserInfo)
    //获取各维度的下拉框数据
    getDimensionDataList(currentUserInfo)
    //获取饼状图下拉框数据
    getPieSelectOptionData()
    getStudentData(currentUserInfo)
  }
  return (
    <div style={{padding: 30, background: '#ececec', width: '100%'}}>
      {/*...*/}
      <Space direction="vertical" style={{width: '100%'}}>
        <PageHeader className="site-page-header" ghost={false} title="毕业意向分析" subTitle="包含多种维度的意向分析" tags={<Tag color="blue">运行中</Tag>} extra={
          <Space><Select placeholder="请选择角色" options={roleList} onChange={(e)=>{roleSelectOnclick(e)}}/></Space>}>
          {content}
          {/*标签页面*/}
          <StudentTag/>
        </PageHeader>
      </Space>
      {/*...*/}

    </div>
  )

}

export default connect(({ Model_GraduationSurveyTeacherModel , user}: any) => ({
  Model_GraduationSurveyTeacherModel,
  user,
}))(GraduationSurveyTeacher)
