import {Button, Tabs} from "antd";
import React, {useEffect, useRef, useState} from "react";
import DownloadCharacterAnalysisReport from "@/pages/CharacterAnalysis/components/DownloadCharacterAnalysisReport";
import CharacterAnalysisAnswer
  from "@/pages/CharacterAnalysis/components/CharacterAnalysisAnswer";
import {EditTwoTone, FilePdfTwoTone, PieChartOutlined, ProfileOutlined} from "@ant-design/icons";


const QuestionnaireTag = (props:any) =>{
  /*
  Tags
  ----------------------------------------------------------------------------------------------------------------------
   */
  //通过时间戳判断是否是新增的新标签
  const [tagTime,setTagTime] = useState();
  const defaultPanes:any = new Array(3).fill(null).map((_, index) => {
    const id = String(index + 1);
    switch (id){
      case '1':
        // @ts-ignore
        return { label: <span><b><EditTwoTone />性格测试调查填写页面</b></span>, children: <CharacterAnalysisAnswer/>, key: id };
      case '2':
        return { label: <span><b><FilePdfTwoTone />性格测试调查报告下载页面</b></span>, children: <DownloadCharacterAnalysisReport />, key: id };
    }
  });
  const [activeKey, setActiveKey] = useState(defaultPanes[0].key);
  const [items, setItems] = useState(defaultPanes);
  const onChangeTags = (key: string) => {
    setActiveKey(key);
  };
  /*
  ----------------------------------------------------------------------------------------------------------------------
  Tags
 */

  useEffect(()=>{
  },[tagTime])

  return (
    <div>
      <Tabs
        hideAdd
        onChange={onChangeTags}
        activeKey={activeKey}
        items={items}
        size={'large'}
      />
    </div>
  );
}
//连接的参数名必须是model的namespace
export default (QuestionnaireTag);
