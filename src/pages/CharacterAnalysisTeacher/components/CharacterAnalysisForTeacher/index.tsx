import React, {useEffect, useState} from "react";
import {Button, Card, Col, Form, Input, Row, Table, Select, Dropdown, Space} from "antd";
import {connect} from "umi";
import {FormInstance} from "antd/lib/form";
import StudentTableData
  from "@/pages/CharacterAnalysisTeacher/components/CharacterAnalysisForTeacher/component/StudentTableData";
import CharacterAnalysisForTeacherModel from "@/models/CharacterAnalysisForTeacher";
import {DownOutlined} from "@ant-design/icons";
import type { MenuProps } from 'antd';

const CharacterAnalysisForTeacher = (props:any)=> {

  /*
  初始化数据
  ----------------------------------------------------------------------------------------------------------------------
   */
  const [flag,setFlag] = useState("1")

  const items: MenuProps['items'] = [
    {
      label: <a>1st menu item</a>,
      key: '0',
    },
    {
      label: <a>2nd menu item</a>,
      key: '1',
    },
    {
      label: <a>2nd menu item</a>,
      key: '2',
    },
  ];
  /*
  ----------------------------------------------------------------------------------------------------------------------
   初始化数据
   */

  /*
  异步请求
  ----------------------------------------------------------------------------------------------------------------------
 */
  const getQuestionnaireList=(flag:any) => {
    console.log(flag)
    if (props.dispatch){
      props.dispatch({
        //路径：model的namespace+effects函数名
        type: 'Model_CharacterAnalysisForTeacherModel/getQuestionnaireListForTeacherEffects',
        payload: {
          flag:flag
        }
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
    getQuestionnaireList(flag)
  },[])
  /*
  ----------------------------------------------------------------------------------------------------------------------
  渲染界面
   */

  return (
    <div style={{ padding: 30, background: ' #ececec', width: '50' }}>
      <Card extra={
        <Select
          placeholder="选择人群"
          onChange={getQuestionnaireList}
          allowClear
        >
          <Option value="0">本科     </Option>
          <Option value="1">复试研究生</Option>
          <Option value="2">调剂研究生</Option>
          <Option value="3">二次调剂研</Option>
        </Select>
      }>

        <StudentTableData></StudentTableData>

      </Card>

    </div>
  )
}

//连接的参数名必须是model的namespace
export default connect(({ Model_CharacterAnalysisForTeacherModel }: any) => ({
  Model_CharacterAnalysisForTeacherModel,
}))(CharacterAnalysisForTeacher);
