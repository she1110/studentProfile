import {Button, Card, Col, Collapse, Form, PageHeader, Row, Select, Space, Tabs, Tag} from "antd";
import {AuditOutlined} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import AnalysisPieChart
  from "@/pages/GraduationSurveyTeacher/components/HorizontalComparisonReport/AnalysisPieChart";
import AnalysisColumnChart
  from "@/pages/GraduationSurveyTeacher/components/HorizontalComparisonReport/AnalysisColumnChart";
import AnalysisLineChart from "@/pages/GraduationSurveyTeacher/components/HorizontalComparisonReport/AnalysisLineChart";
import {connect} from "umi";

const Panel = Collapse.Panel;
const HorizontalComparisonReport = (props:any) =>{
  /*
  初始化变量
  ----------------------------------------------------------------------------------------------------------------------
   */
  const [columnDataList, setColumnDataList] = useState<any[]>([[],[],[],[]]);
  const [majorLineData, setMajorLineData] = useState<any[]>([]);
  const [classLineData, setClassLineData] = useState<any[]>([]);
  const [majorPieData, setMajorPieData] = useState<any[]>([]);
  const [classPieData, setClassPieData] = useState<any[]>([]);
  //各个维度的选择器数据
  const [dimensionDataList, setDimensionDataList] = useState<any[]>([[],[],[],[]]);
  //饼状图选择器数据即毕业意向信息
  const [pieSelectOptions,setPieSelectOptions] = useState<any[]>([])
  /*
  ----------------------------------------------------------------------------------------------------------------------
   初始化变量
   */

  /*
  异步操作
  ----------------------------------------------------------------------------------------------------------------------
   */
  //设置折线图数据
  const getMajorLineData = (value:any)=>{
    if (props.dispatch) {
      props.dispatch({
        type: 'Model_GraduationSurveyTeacherModel/getLineDataFromSerices',
        payload: {
          value: value,
          callback: (value: any) => {
            setMajorLineData(value)
          },
        },
      });
    }
  }
  //设置折线图数据
  const getClassLineData = (value:any)=>{
    if (props.dispatch) {
      props.dispatch({
        type: 'Model_GraduationSurveyTeacherModel/getLineDataFromSerices',
        payload: {
          value: value,
          callback: (value: any) => {
            setClassLineData(value)
          },
        },
      });
    }
  }
  //设置饼状图数据
  const getMajorPieData = (value:any)=>{
    if (props.dispatch) {
      props.dispatch({
        type: 'Model_GraduationSurveyTeacherModel/getPieDataFromSerices',
        payload: {
          value: value,
          callback: (value: any) => {
            setMajorPieData(value)
          },
        },
      });
    }
  }
  //设置饼状图数据
  const getClassPieData = (value:any)=>{
    if (props.dispatch) {
      props.dispatch({
        type: 'Model_GraduationSurveyTeacherModel/getPieDataFromSerices',
        payload: {
          value: value,
          callback: (value: any) => {
            setClassPieData(value)
          },
        },
      });
    }
  }
  useEffect(()=>{
    console.log(props)
    if (props.Model_GraduationSurveyTeacherModel.columnDataList.length !== 0){
      setColumnDataList(props.Model_GraduationSurveyTeacherModel.columnDataList)
    }
    if (props.Model_GraduationSurveyTeacherModel.dimensionDataList.length !== 0){
      setDimensionDataList(props.Model_GraduationSurveyTeacherModel.dimensionDataList)
    }
    if (props.Model_GraduationSurveyTeacherModel.intentionData.length !== pieSelectOptions.length){
      setPieSelectOptions(props.Model_GraduationSurveyTeacherModel.intentionData)
    }
  },[props])
  /*
  ----------------------------------------------------------------------------------------------------------------------
   异步操作
   */

  /*
  函数
  ----------------------------------------------------------------------------------------------------------------------
   */
  //设置专业维度折线图数据
  const majorLineSelectOnChange = (majorId:any) => {
    //变量名不能改
    let value = {
      accountId: props.Model_GraduationSurveyTeacherModel.accountId,
      dimensionId: "0",
      id: majorId,
      roleId: props.Model_GraduationSurveyTeacherModel.currentRoleId
    }
    getMajorLineData(value)
  }
  //设置班级维度折线图数据
  const classLineSelectOnChange = (classId:any) => {
    //变量名不能改
    let value = {
      accountId: props.Model_GraduationSurveyTeacherModel.accountId,
      dimensionId: "1",
      id: classId,
      roleId: props.Model_GraduationSurveyTeacherModel.currentRoleId
    }
    getClassLineData(value)
  }
  //设置专业维度饼状图数据
  const majorPieSelectOnChange = (intentionId:any) => {
    //变量名不能改
    let value = {
      accountId: props.Model_GraduationSurveyTeacherModel.accountId,
      dimensionId: "0",
      intentionId: intentionId,
      roleId: props.Model_GraduationSurveyTeacherModel.currentRoleId
    }
    getMajorPieData(value)
  }
  //设置班级维度饼状图数据
  const classPieSelectOnChange = (intentionId:any) => {
    //变量名不能改
    let value = {
      accountId: props.Model_GraduationSurveyTeacherModel.accountId,
      dimensionId: "1",
      intentionId: intentionId,
      roleId: props.Model_GraduationSurveyTeacherModel.currentRoleId
    }
    getClassPieData(value)
  }
  /*
  ----------------------------------------------------------------------------------------------------------------------
   函数
   */

  return (
    <div>
      <Space direction="vertical" style={{width: '100%'}}>
        <Card>
          <Collapse>
            <Panel header="专业维度" key="1">
              <Row justify={"center"}>
                <Card title={'折线图'} style={{width:'60%'}} extra={
                      <Select placeholder={"选择专业"} style={{width: 150}} options={dimensionDataList[0]} onChange={majorLineSelectOnChange}>
                      </Select>
                }>
                  <AnalysisLineChart data={majorLineData}/>
                </Card>
              </Row>
              <Row>
                <Col span={12}>
                  <Card  title={'饼状图'} extra={
                    <Select style={{width: 150}} placeholder={"选择毕业意向"} options={pieSelectOptions} onChange={majorPieSelectOnChange} >
                    </Select>
                  }>
                    <AnalysisPieChart data={majorPieData}/>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card  title={'叠状图'}>
                    <AnalysisColumnChart columnData={columnDataList[0]}/>
                  </Card>
                </Col>
              </Row>
            </Panel>
            <Panel header="班级维度" key="2">
              <Row justify={"center"}>
                <Card title={'折线图'} style={{width:'60%'}} extra={
                  <Select style={{width: 150}} options={dimensionDataList[1]} onChange={classLineSelectOnChange}>
                  </Select>
                }>
                  <AnalysisLineChart data={classLineData}/>
                </Card>
              </Row>
              <Row>
                <Col span={12}>
                  <Card  title={'饼状图'} extra={
                    <Select style={{width: 150}} placeholder={"选择毕业意向"} options={pieSelectOptions} onChange={classPieSelectOnChange} >
                    </Select>
                  }>
                    <AnalysisPieChart data={classPieData}/>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card  title={'叠状图'}>
                    <AnalysisColumnChart columnData={columnDataList[1]} />
                  </Card>
                </Col>
              </Row>
            </Panel>
            {/*
            <Panel header="宿舍维度" key="3">
              <Row justify={"center"}>
                <AnalysisLineChart/>
                <Form>
                  <Form.Item labelAlign={'right'} label="选择宿舍" name="dashBoardName">
                    <Select style={{width: 150}} options={dimensionDataList[2]}>
                    </Select>
                  </Form.Item>
                </Form>
              </Row>
              <Row>
                <Col span={12}>
                  <Card  title={'饼状图'} extra={
                    <Select style={{width: 150}} placeholder={"选择毕业意向"}>
                    </Select>
                  }>
                    <AnalysisPieChart data={data1}/>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card  title={'叠状图'}>
                    <AnalysisColumnChart columnData={columnDataList[2]} />
                  </Card>
                </Col>
              </Row>
            </Panel>
            <Panel header="教师维度" key="4">
              <Row justify={"center"}>
                <AnalysisLineChart/>
                <Form>
                  <Form.Item labelAlign={'right'} label="教师" name="dashBoardName">
                    <Select style={{width: 100}}  options={dimensionDataList[3]}>
                    </Select>
                  </Form.Item>
                </Form>
              </Row>
              <Row>
                <Col span={12}>
                  <Card  title={'饼状图'} extra={
                    <Select style={{width: 150}} placeholder={"选择毕业意向"}>
                    </Select>
                  }>
                    <AnalysisPieChart data={data3}/>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card  title={'叠状图'}>
                    <AnalysisColumnChart columnData={columnDataList[3]} />
                  </Card>
                </Col>
              </Row>
            </Panel>
            */}
          </Collapse>
        </Card>
      </Space>
    </div>
  );
}
//连接的参数名必须是model的namespace
export default connect(({ Model_GraduationSurveyTeacherModel }: any) => ({
  Model_GraduationSurveyTeacherModel,
}))(HorizontalComparisonReport);
