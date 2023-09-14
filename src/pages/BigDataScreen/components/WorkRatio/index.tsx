import React from 'react';
import {Bar} from '@ant-design/charts';

const WorkRatio: React.FC = () => {
  var data = [
    {
      type: '软件工程',
      sales: 91,
    },
    {
      type: '物联网工程',
      sales: 90,
    },
    {
      type: '计算机网络',
      sales: 88,
    },
    {
      type: '数据科学',
      sales: 83,
    },
    {
      type: '人工智能',
      sales: 88,
    },
  ];
  var config = {
    data: data,
    xField: 'sales',
    yField: 'type',
    seriesField: 'type',
    legend: false,
    meta: {
      sales: {alias: '人数'},
    },
  };
  return (
    <div style={{width: '450px', height: '300px', paddingTop: 20}}>
      <Bar {...config} />
    </div>
  );
};

export default WorkRatio;
