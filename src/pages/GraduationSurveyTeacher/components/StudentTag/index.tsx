import {Button, Tabs} from "antd";
import React, {useEffect, useRef, useState} from "react";
import HorizontalComparisonReport from "@/pages/GraduationSurveyTeacher/components/HorizontalComparisonReport";
import DownloadGraduationIntentionReport
  from "@/pages/GraduationSurveyTeacher/components/DownloadGraduationIntentionReport";
import {PieChartOutlined, ProfileOutlined} from "@ant-design/icons";
import IntentionReportPersonal from "@/pages/GraduationSurveyTeacher/components/IntentionReportPersonal";
import PersonalReportHistoryForm
  from "@/pages/GraduationSurveyTeacher/components/IntentionReportPersonal/PersonalReportHistoryForm";



const StudentTag = (props:any) =>{
  /*
  Tags
  ----------------------------------------------------------------------------------------------------------------------
   */
  //新标签名称
  const [tagName,setTagName] = useState('');
  //通过时间戳判断是否是新增的新标签
  const [tagTime,setTagTime] = useState();
  const addTagsClick = (record:any) => {
    //console.log(record.studentId);
    const newActiveKey = `newTab${newTabIndex.current++}`;
    setItems([...items, { label: record.studentName, children: <PersonalReportHistoryForm studentId={record.studentId}/>, key: newActiveKey }]);
    // setActiveKey(newActiveKey);//新增完跳转
  };
  const defaultPanes:any = new Array(3).fill(null).map((_, index) => {
    const id = String(index + 1);
    switch (id){
      case '1':
        // @ts-ignore
        return { label: <span><b><ProfileOutlined />意向报表汇总下载</b></span>, children: <DownloadGraduationIntentionReport/>, key: id };
      case '2':
        return { label: <span><b><PieChartOutlined />毕业意向分析</b></span>, children: <HorizontalComparisonReport />, key: id };
      case '3':
        return { label: <span><b><PieChartOutlined />个人毕业意向详情</b></span>, children: <IntentionReportPersonal setTagName={setTagName} setTagTime={setTagTime}/>, key: id };
    }
  });
  const [activeKey, setActiveKey] = useState(defaultPanes[0].key);
  const [items, setItems] = useState(defaultPanes);
  const newTabIndex = useRef(0);
  const onChangeTags = (key: string) => {
    setActiveKey(key);
  };
  const remove = (targetKey: string) => {
    const targetIndex = items.findIndex((pane: { key: any; }) => pane.key === targetKey);
    const newPanes = items.filter((pane: { key: any; }) => pane.key !== targetKey);
    if (newPanes.length && targetKey === activeKey) {
      const { key } = newPanes[targetIndex === newPanes.length ? targetIndex - 1 : targetIndex];
      setActiveKey(key);
    }
    setItems(newPanes);
  };
  const onEdit = (targetKey: string, action: 'add' | 'remove') => {
    if (action === 'add') {
    } else {
      if (targetKey!=='1'&&targetKey!=='2'&&targetKey!=='3'){
        remove(targetKey);
      }
    }
  };
  /*
  ----------------------------------------------------------------------------------------------------------------------
  Tags
 */

  useEffect(()=>{
    if (tagName!==''){
      addTagsClick(tagName)
    }
  },[tagTime])

  return (
    <div>
      <Tabs
        hideAdd
        onChange={onChangeTags}
        activeKey={activeKey}
        type="editable-card"
        // @ts-ignore
        onEdit={onEdit}
        items={items}
        size={'large'}
      />
    </div>
  );
}
//连接的参数名必须是model的namespace
export default (StudentTag);
