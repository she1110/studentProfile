import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Pie } from '@ant-design/plots';

const AnalysisPieChart = (props:any) => {
  const [data, setData] = useState([]);
  /*
异步操作
----------------------------------------------------------------------------------------------------------------------
*/
  useEffect(()=>{
    if(props.data.length !== 0){
      setData(props.data)
    }
  },[props.data])
  /*
  ----------------------------------------------------------------------------------------------------------------------
   异步操作
   */
  const config = {
    appendPadding: 10,
    data,
    angleField: 'VALUE',
    colorField: 'TYPE',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {value}',
    },
    interactions: [
      {
        type: 'pie-legend-active',
      },
      {
        type: 'element-active',
      },
    ],
  };
  return <Pie {...config} />;
};

export default (AnalysisPieChart)
