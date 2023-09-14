import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Column, G2 } from '@ant-design/plots';

const AnalysisColumnChart = (props:any) => {
  const [data, setData] = useState<any[]>([]);
  // const [data, setData] = useState([
  //   {
  //     "group": "贾碧筱",
  //     "intention": "考公",
  //     "value": 92.1
  //   },
  //   {
  //     "group": "贾碧筱",
  //     "intention": "暂不就业",
  //     "value": 145.1
  //   },
  //   {
  //     "group": "常丽君",
  //     "intention": "考公",
  //     "value": 91.8
  //   },
  //   {
  //     "group": "常丽君",
  //     "intention": "暂不就业",
  //     "value": 140.9
  //   },
  //   {
  //     "group": "齐巧玲",
  //     "intention": "考公",
  //     "value": 87.1
  //   },
  //   {
  //     "group": "齐巧玲",
  //     "intention": "暂不就业",
  //     "value": 139.4
  //   }
  // ]);

  G2.registerInteraction('element-link', {
    start: [
      {
        trigger: 'interval:mouseenter',
        action: 'element-link-by-color:link',
      },
    ],
    end: [
      {
        trigger: 'interval:mouseleave',
        action: 'element-link-by-color:unlink',
      },
    ],
  });


  /*
  异步操作
  ----------------------------------------------------------------------------------------------------------------------
   */
  useEffect(()=>{
    setData(props.columnData)
  },[props])
  /*
  ----------------------------------------------------------------------------------------------------------------------
  异步操作
   */
  const config = {
    data,
    xField: 'TYPE',
    yField: 'VALUE',
    seriesField: 'INTENTION',
    isPercent: true,
    isStack: true,
    meta: {
      value: {
        min: 0,
        max: 1,
      },
    },
    label: {
      position: 'middle',
      content: (item:any) => {
        return `${(item.VALUE * 100).toFixed(2)}%`;
      },
      style: {
        fill: '#fff',
      },
    },
    tooltip: false,
    interactions: [
      {
        type: 'element-highlight-by-color',
      },
      {
        type: 'element-link',
      },
    ],
  };

  // @ts-ignore
  return <Column {...config} />;
};

export default (AnalysisColumnChart)
