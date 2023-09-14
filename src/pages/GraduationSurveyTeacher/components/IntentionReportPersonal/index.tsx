import {Card, Col, Collapse, PageHeader, Row, Space, Tabs, Tag} from "antd";
import React, {useRef, useState} from "react";
import StudentTableList from "@/pages/GraduationSurveyTeacher/components/IntentionReportPersonal/StudentTableList";

const IntentionReportPersonal = (props:any) =>{

  const onClick = (value:any) => {
    props.setTagName(value)
    console.log((new Date().getTime() / 1000).toString())
    props.setTagTime((new Date().getTime() / 1000).toString())
  }
  return (
    <div>
      <Space direction="vertical" style={{width: '100%'}}>
        <Card>
          <StudentTableList addTagsClick={onClick}/>
        </Card>
      </Space>
    </div>
  );
}
//连接的参数名必须是model的namespace
export default (IntentionReportPersonal);
