import React from 'react';
import {Bar} from '@ant-design/charts';

const StaffChart: React.FC = () => {
  var data = [
    {
      type: '专任教师',
      sales: 92,
    },
    {
      type: '副教授',
      sales: 26,
    },
    {
      type: '教授',
      sales: 19,
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
    <div style={{width: '350px', height: '180px', paddingTop: 20}}>
      <Bar {...config} />
    </div>
  );
};

export default StaffChart;
