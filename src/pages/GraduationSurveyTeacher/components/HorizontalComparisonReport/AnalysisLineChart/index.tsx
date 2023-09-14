import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { G2, Line } from '@ant-design/plots';

const AnalysisLineChart = (props:any) => {

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


  G2.registerShape('point', 'breath-point', {
    draw(cfg, container) {
      const data = cfg.data;
      const point = {
        x: cfg.x,
        y: cfg.y,
      };
      const group = container.addGroup();
      return group;
    },
  });
  const config = {
    autoFit: true,
    height: 500,
    data,
    meta: {
      number: {
        time: {
          type: 'cat',
        },
        max: 100,
        min: 0,
      },
    },
    xField: 'time',
    yField: 'total',
    seriesField: 'intentionState',
    tooltip: {
      showMarkers: false,
    },
    point: {
      shape: 'breath-point',
    },
  };

  return (
    <>
      <Line {...config} />
    </>
  )
};

export default (AnalysisLineChart)
