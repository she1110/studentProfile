import {Badge, Button, Card, Select, Menu, Modal, AutoComplete, Col, Row, Form, Input, message} from 'antd';
import DashboardTable from './components/DashBoardTable/index'
import DashBoardHaveIn from './components/DashBoardHaveIn/index'
import React, {useEffect, useState} from 'react';
import {connect, Dispatch} from "umi";

export type dashBoardListType = {
  key: string,
  profileName: string,
  profileId: string,
  dispatch: any
}

export type profileNameFuzzyListType = {
  value: string
  key: string
}

export type roleListType = {
  value: string,
  lable: string,
}

const ResponsibilityManageWindow = (props:any) => {
  /*
  初始化数据
  ----------------------------------------------------------------------------------------------------------------------
   */
  //已添加分群数据
  const [dashBoardHaveIn,setDashBoardHaveIn] = useState<dashBoardListType[]>([])
  //未添加分群列表数据，用于显示
  const [dashBoardListShow,setDashBoardListShow] = useState<dashBoardListType[]>([])
  //一直不变的未添加分群的列表数据
  const [dashBoardList,setDashBoardList] = useState<dashBoardListType[]>([])
  //角色列表
  const [roleList,setRoleList] = useState<roleListType[]>([])
  //当前角色
  const [roleId,setRoleId] = useState()
  //查询角色表单
  const [roleForm] = Form.useForm()
  //模糊查询列表
  const [profileNameFuzzyList,setProfileNameFuzzyList] = useState<profileNameFuzzyListType[]>([])
  /*
  ----------------------------------------------------------------------------------------------------------------------
  初始化数据
   */

  /*
  异步请求
  ----------------------------------------------------------------------------------------------------------------------
   */
  //获取已管理分群列表数据
  const getDashBoardHaveInListEffect = (value:any) => {
    props.dispatch({
      type: 'Model_CrowdManagementType/getDashBoardHaveInListFromServices',
      payload: {
        value:value,
        callback: (value: any) => {
          if (typeof  value !== 'undefined'){
            setDashBoardHaveIn(value)
          }else setDashBoardHaveIn([])
        },
      },
    });
  }
  //获取未管理分群列表数据
  const getDashBoardListShowEffect = (value:any) => {
    props.dispatch({
      type: 'Model_CrowdManagementType/getDashBoardListFromServices',
      payload: {
        value,
        callback: (value: any) => {
          setDashBoardListShow(value)
        },
      },
    });
  }
  //获取分群列表数据，只调用一次
  const getDashBoardListEffect = (value:any) => {
    props.dispatch({
      type: 'Model_CrowdManagementType/getDashBoardListFromServices',
      payload: {
        value:value,
        callback: (value: any) => {
          setDashBoardList(value)
        },
      },
    });
  }
  //获取本用户角色列表
  const getRoleListByTeacherIdEffect = () => {
    props.dispatch({
      type: 'Model_CrowdManagementType/getRoleListByTeacherIdFromServices',
      payload: {
        //由于props.rowRecord.accountId会在主页面初始化时（即弹窗还没有打开的时候）触发，而此时数据还没有过来，所以没有accountId这个属性
        value: props.rowRecord.accountId,
        callback: (value: any) => {
          setRoleList(value)
        },
      },
    });
  }
  //删除管理中的分群
  const deleteDashBoardHaveInEffect = (value:any) => {
    props.dispatch({
      type: 'Model_CrowdManagementType/deleteDashBoardHaveInFromServices',
      payload: {
        value:value,
        callback: (value: any) => {
          console.log(value);
        },
      },
    });
  }
  //增加分群
  const addDashBoardToTeacherEffect = (value:any) => {
    props.dispatch({
      type: 'Model_CrowdManagementType/addDashBoardToTeacherFromServices',
      payload: {
        value:value,
        callback: (value: any) => {
          console.log(value);
        },
      },
    });
  }
  /*
  ----------------------------------------------------------------------------------------------------------------------
  异步请求
   */

  /*
  函数功能
  ----------------------------------------------------------------------------------------------------------------------
   */
  //按角色查询按钮
  const onSearchRoleButton = (value:any) =>{
    //设置当前所选的角色id
    setRoleId(value[0].value)
    let dashBoardHaveInItem = {
      accountId: props.rowRecord.accountId,
      profileId: '',
      roleId: value[0].value
    }
    //更新两个表格
    getDashBoardHaveInListEffect(dashBoardHaveInItem)
    getDashBoardListShowEffect(dashBoardHaveInItem)
    //初始化分群列表
    getDashBoardListEffect(dashBoardHaveInItem)
  }
  //查询分群按钮
  const onSearchDashBoardButton = (value:any) =>{
    let index = dashBoardList.findIndex((item: { profileName: any; })=>item.profileName===value.profileName)
    console.log(index)
    if (index !== -1){//若不空
      let dashBoardItem = {
        accountId: props.rowRecord.accountId,
        profileId: dashBoardList[index].profileId,
        roleId: roleId
      }
      getDashBoardListShowEffect(dashBoardItem)
    }else if(index === -1&&value===''){//若空则返回全部
      let dashBoardItem = {
        accountId: props.rowRecord.accountId,
        profileId: '',
        roleId: roleId
      }
      getDashBoardListShowEffect(dashBoardItem)
    }else if(index === -1&&value!==''){//若查询不到则直接不请求异步
      setDashBoardListShow([])
    }
  }
  //删除正在管理中的分群
  const deleteDashBoardHaveIn = (value:any) => {
    console.log('delete')
    let newDashBoardHaveIn = JSON.parse(JSON.stringify(dashBoardHaveIn))
    let index = newDashBoardHaveIn.findIndex((item: { profileId: any; })=>item.profileId===value.profileId)
    //在未管理的分群中增加一条
    let newDashBoardListShow = JSON.parse(JSON.stringify(dashBoardListShow))
    newDashBoardListShow.push(dashBoardHaveIn[index])
    setDashBoardListShow(newDashBoardListShow)
    //在查询列表中增加一条
    let newDashBoardList = JSON.parse(JSON.stringify(dashBoardList))
    newDashBoardList.push(dashBoardHaveIn[index])
    setDashBoardList(newDashBoardList)
    //删除
    newDashBoardHaveIn.splice(index,1)
    setDashBoardHaveIn(newDashBoardHaveIn)
    let dashBoardItem = {
      accountId: props.rowRecord.accountId,
      profileId: value.profileId,
      roleId: roleId
    }
    deleteDashBoardHaveInEffect(dashBoardItem)
  }
  //增加未被管理的分群
  const addDashBoardToTeacher = (value:any) => {
    console.log('add')
    if(dashBoardHaveIn.length===0){
      let newDashBoardListShow = JSON.parse(JSON.stringify(dashBoardListShow ))
      let index = newDashBoardListShow.findIndex((item: { profileId: any; })=>item.profileId===value.profileId)
      //在正在管理的分群中增加一条
      let newDashBoardHaveIn = JSON.parse(JSON.stringify(dashBoardHaveIn))
      newDashBoardHaveIn.push(newDashBoardListShow[index])
      setDashBoardHaveIn(newDashBoardHaveIn)
      //然后在未添加分群列表显示的列表中删除这一条
      newDashBoardListShow.splice(index,1)
      setDashBoardListShow(newDashBoardListShow)
      //在分群列表中也删除
      let dashBoardListIndex = dashBoardList.findIndex((item: { profileId: any; })=>item.profileId===value.profileId)
      let newDashBoardList = JSON.parse(JSON.stringify(dashBoardList))
      newDashBoardList.splice(dashBoardListIndex,1)
      setDashBoardList(newDashBoardList)
      //调用异步函数
      let dashBoardItem = {
        accountId: props.rowRecord.accountId,
        profileId: value.profileId,
        roleId: roleId
      }
      addDashBoardToTeacherEffect(dashBoardItem)
    }else {
      message.error("已有管理中的分群，添加失败")
    }
  }
  //模糊查询分群名称
  const searchDashBoardFuzzily = (value:any) => {
    //模糊匹配
    let profileNameFuzzyListCopy:any = []
    for (let i = 0; i < dashBoardList.length; i++) {
      if(dashBoardList[i].profileName.includes(value)){
        let name = {value : dashBoardList[i].profileName,key: dashBoardList[i].profileId}
        profileNameFuzzyListCopy.push(name)
      }
    }
    setProfileNameFuzzyList(profileNameFuzzyListCopy)
  }
  /*
  ----------------------------------------------------------------------------------------------------------------------
  函数功能
 */

  /*
  页面渲染
  ----------------------------------------------------------------------------------------------------------------------
   */
  //初始化时执行一次，且渲染画面
  useEffect(() => {
  }, [])
  //变量变化时执行一次，且渲染画面
  useEffect(() => {
    //当窗口状态是打开的时候获取本角色列表
    if(props.dispatch&&props.windowFlag) {
      getRoleListByTeacherIdEffect()
    }
  }, [props.rowRecord])
  /*
  ----------------------------------------------------------------------------------------------------------------------
  页面渲染
  */

  return (
    <>
      <Modal
        title= {props.windowFlag?props.rowRecord.accountName+'的责任管理':'责任管理'}//若props.windowFlag不为空则说明已经点击弹窗，此时props.rowRecord.name不为空
        centered
        visible={props.windowFlag}
        onOk={() => {
          props.setWindowFlag(false)
          setDashBoardHaveIn([])
          setDashBoardListShow([])
        }}
        onCancel={() => {
          props.setWindowFlag(false)
          setDashBoardHaveIn([])
          setDashBoardListShow([])
        }}
        width={800}
        destroyOnClose={true}
      >

        {/*选择角色...*/}
        <Form preserve={false} onFieldsChange={onSearchRoleButton} form={roleForm}>
          <Row gutter={[16, 0]}>
            <Col>
              <Form.Item label="选择角色" name="roleName">
                <Select style={{width: 170}} options={roleList} ></Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        {/*选择角色...*/}

        {/*正在管理中的分群...*/}
        <Card title="正在管理中的分群">
          <DashBoardHaveIn data={dashBoardHaveIn} deleteDashBoardHaveIn={deleteDashBoardHaveIn}></DashBoardHaveIn>
        </Card>
        {/*正在管理中的分群...*/}

        {/*所有分群列表...*/}
        <Card  title="未管理的分群">
          <Form preserve={false} onFinish={onSearchDashBoardButton} >
            <Row gutter={20} justify={"end"}>
              <Col span={12}>
                <Input.Group compact>
                  <Form.Item name="profileName" style={{width:'100%'}}>
                    <AutoComplete
                      style={{ width: '100%' }}
                      onChange={searchDashBoardFuzzily}
                      placeholder="分群名称"
                      options={profileNameFuzzyList}
                    />
                  </Form.Item>
                </Input.Group>
              </Col>
              <Col>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
              </Col>
            </Row>
          </Form>

          {/*表格：显示分群列表*/}
          <DashboardTable data={dashBoardListShow} addDashBoardToTeacher={addDashBoardToTeacher}></DashboardTable>
        </Card>
        {/*所有分群列表...*/}

      </Modal>
    </>
  );
};

export default connect(({ Model_CrowdManagementType }: any) => ({
  Model_CrowdManagementType
}))(ResponsibilityManageWindow);
